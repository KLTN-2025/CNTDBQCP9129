import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import Order from "../../model/order.model.js";
import Voucher from "../../model/voucher.model.js";
import Recipe from "../../model/recipe.model.js"; 
import Ingredient from "../../model/ingredient.model.js"; 
import { calculateVoucherDiscount } from "../voucher/voucher.controller.js";

const vnpay = new VNPay({
  tmnCode: "6Z3TSPO9",
  secureSecret: "40YYRRUMS9DEF74CWS38QO5DL68TOUI5",
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
  enableLog: true,
  loggerFn: ignoreLogger,
});

const getIPv4 = (ip) => {
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }
  return ip.replace("::ffff:", "");
};

// Hàm tự động hủy order sau 15 phút nếu không thanh toán
const scheduleOrderCancellation = async (orderId) => {
  setTimeout(async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);

      if (order && order.paymentStatus === "PENDING") {
        // HOÀN LẠI NGUYÊN LIỆU THEO CÔNG THỨC
        for (const item of order.items) {
          const recipe = await Recipe.findOne({
            productId: item.productId,
          }).session(session);

          if (recipe) {
            for (const r of recipe.items) {
              const requiredAmount = r.quantity * item.quantity;
              await Ingredient.findByIdAndUpdate(
                r.ingredientId,
                { $inc: { quantity: requiredAmount } },
                { session }
              );
            }
          }
        }

        order.status = "CANCELLED";
        order.paymentStatus = "FAILED";
        await order.save({ session });
        await session.commitTransaction();
        console.log(`Order ${orderId} đã tự động hủy và hoàn nguyên liệu`);
      } else {
        await session.abortTransaction();
      }
    } catch (err) {
      await session.abortTransaction();
      console.error(`Lỗi khi tự động hủy order ${orderId}:`, err);
    } finally {
      session.endSession();
    }
  }, 30 * 1000); // 15 phút
};

export const createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cartItems, userId, delivery, voucherCode } = req.body;
    if (!delivery || !delivery.name || !delivery.phone) {
      return res.status(400).json({
        message: "Thiếu thông tin giao hàng",
        delivery: delivery || {},
      });
    }
    if (!cartItems || !cartItems.length) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }
    // BƯỚC 1: TÍNH TỔNG TIỀN VÀ FORMAT ITEMS
    let total = 0;
    const detailedItems = [];

    for (const item of cartItems) {
      if (!item.productId || !item.quantity) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Sản phẩm hoặc số lượng không hợp lệ" });
      }
      const product = await Product.findById(item.productId._id).session(
        session
      );

      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Sản phẩm không tồn tại`,
        });
      }

      const itemPrice = product.price * (1 - product.discount / 100);
      const itemTotal = itemPrice * item.quantity;
      total += itemTotal;

      detailedItems.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        note: item.note || "",
      });
    }

    // Phí vận chuyển
    let shippingFee = 0;
    if (delivery?.address) {
      shippingFee = 20000;
      total += shippingFee;
    }

    // Áp dụng voucher
    let discount = 0;
    let voucherId = null;
    if (voucherCode) {
      const result = await calculateVoucherDiscount({
        voucherCode,
        items: cartItems.map((i) => i.productId.productCategoryId),
        total,
        userId,
      });
      discount = result.discount;
      voucherId = result.voucherId;
      total -= discount;
      if (total < 0) total = 0;
    }

    total = Math.round(total);

    // BƯỚC 2: KIỂM TRA VÀ TRỪ KHO NGUYÊN LIỆU THEO CÔNG THỨC
    for (const item of detailedItems) {
      // Tìm công thức cho sản phẩm này
      const recipe = await Recipe.findOne({
        productId: item.productId,
      }).session(session);

      if (!recipe) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Sản phẩm "${item.name}" chưa có công thức`,
          productId: item.productId,
        });
      }

      // Kiểm tra và trừ từng nguyên liệu trong công thức
      for (const recipeItem of recipe.items) {
        const requiredAmount = recipeItem.quantity * item.quantity;

        // TRỪ NGUYÊN LIỆU (atomic operation)
        const updated = await Ingredient.updateOne(
          {
            _id: recipeItem.ingredientId,
            quantity: { $gte: requiredAmount },
            status: true,
          },
          {
            $inc: { quantity: -requiredAmount },
          },
          { session }
        );

        // Nếu không trừ được = hết nguyên liệu
        if (updated.modifiedCount === 0) {
          await session.abortTransaction();
          return res.status(400).json({
            message: `Kho không đủ nguyên liệu`,
          });
        }
      }
    }

    // BƯỚC 3: TẠO ORDER VỚI STATUS PENDING_PAYMENT
    const newOrder = new Order({
      userId,
      voucherId,
      items: detailedItems,
      voucherDiscount: discount,
      delivery,
      orderType: "ONLINE",
      paymentMethod: "VNPAY",
      totalPrice: total,
      paymentStatus: "PENDING",
    });

    await newOrder.save({ session });

    // Commit transaction - ĐÃ GIỮ NGUYÊN LIỆU THÀNH CÔNG
    await session.commitTransaction();

    // Đặt lịch tự động hủy nếu không thanh toán
    scheduleOrderCancellation(newOrder._id);

    // BƯỚC 4: TẠO VNPAY URL
    const txnRef = newOrder._id.toString();
    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: total,
      vnp_IpAddr: getIPv4(req.ip || "127.0.0.1"),
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${txnRef}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:5000/api/payment/vnpay-return",
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
    });

    return res.status(200).json({
      success: true,
      vnpUrl: vnpayResponse,
      orderId: newOrder._id,
      txnRef,
      total,
      discount,
      items: detailedItems,
      message: "Đơn hàng đã được tạo. Vui lòng thanh toán trong 15 phút",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({
      message: "Tạo thanh toán thất bại",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

export const handleVnpayReturn = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(" VNPay callback received:", req.query);

    // Verify chữ ký từ VNPay
    const verify = vnpay.verifyReturnUrl(req.query);

    if (!verify.isVerified) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Chữ ký không hợp lệ",
        code: "97",
      });
    }

    const orderId = verify.vnp_TxnRef;
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        code: "01",
      });
    }

    // Kiểm tra order đã được xử lý chưa
    if (order.paymentStatus !== "PENDING") {
      await session.abortTransaction();
      return res.status(200).json({
        message: "Đơn hàng đã được xử lý trước đó",
        paymentStatus: order.paymentStatus,
        orderId: order._id,
      });
    }

    // THANH TOÁN THÀNH CÔNG
    if (verify.isSuccess) {
      order.paymentStatus = "SUCCESS";
      order.vnp_PayDate = new Date();
      order.vnp_TransactionNo = verify.vnp_TransactionNo;
      order.vnp_Amount = verify.vnp_Amount; 
      
      if (order.voucherId) {
        await Voucher.findByIdAndUpdate(
          order.voucherId,
          { $inc: { usedCount: 1 } },
          { session }
        );
      }

      await order.save({ session });
      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
        code: "00",
        orderId: order._id,
        amount: verify.vnp_Amount,
        transactionNo: verify.vnp_TransactionNo,
      });
    }
    else {
      // Hoàn lại nguyên liệu theo công thức
      for (const item of order.items) {
        const recipe = await Recipe.findOne({
          productId: item.productId,
        }).session(session);

        if (recipe) {
          for (const r of recipe.items) {
            const requiredAmount = r.quantity * item.quantity;
            await Ingredient.findByIdAndUpdate(
              r.ingredientId,
              { $inc: { quantity: requiredAmount } },
              { session }
            );
          }
        }
      }

      order.status = "CANCELLED";
      order.paymentStatus = "FAILED"
      await order.save({ session });
      await session.commitTransaction();
      return res.status(400).json({
        success: false,
        message: "Giao dịch thất bại, nguyên liệu đã được hoàn lại",
        code: verify.vnp_ResponseCode,
        orderId: order._id,
      });
    }
  } catch (err) {
    await session.abortTransaction();
    console.error("VNPAY CALLBACK ERROR:", err);
    res.status(500).json({
      message: "Xử lý callback thất bại",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};
