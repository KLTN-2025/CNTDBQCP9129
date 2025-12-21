import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";
import mongoose from "mongoose";
import Product from "../../model/product.model.js";
import Order from "../../model/order.model.js";
import Voucher from "../../model/voucher.model.js";
import Recipe from "../../model/recipe.model.js";
import Ingredient from "../../model/ingredient.model.js";
import Cart from "../../model/cart.model.js";

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
  }, 1 * 60 * 1000);
};

export const createPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cartItems, userId, delivery, voucher } = req.body;

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

    let total = 0;
    const detailedItems = [];

    for (const item of cartItems) {
      if (!item.productId || !item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Sản phẩm hoặc số lượng không hợp lệ",
        });
      }

      const product = await Product.findById(item.productId).session(session);
      if (!product || product.status === false) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Sản phẩm đã ngừng bán",
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

    // Phí ship
    let shippingFee = 0;
    if (delivery?.address) {
      shippingFee = 20000;
      total += shippingFee;
    }

    // Voucher
    if (voucher && voucher.discount) {
      total -= Number(voucher.discount);
      if (total < 0) total = 0;
    }

    total = Math.round(total);

    for (const item of detailedItems) {
      const recipe = await Recipe.findOne({
        productId: item.productId,
      }).session(session);

      if (!recipe) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Sản phẩm "${item.name}" chưa có công thức`,
        });
      }

      for (const recipeItem of recipe.items) {
        const requiredAmount = recipeItem.quantity * item.quantity;

        const ingredientAfterUpdate = await Ingredient.findOneAndUpdate(
          {
            _id: recipeItem.ingredientId,
            quantity: { $gte: requiredAmount },
            status: true,
          },
          {
            $inc: { quantity: -requiredAmount },
          },
          {
            new: true,
            session,
          }
        );

        if (!ingredientAfterUpdate) {
          await session.abortTransaction();
          return res.status(400).json({
            message: "Kho không đủ nguyên liệu hoặc nguyên liệu đã ngừng hoạt động",
          });
        }

        if (ingredientAfterUpdate.quantity === 0) {
          ingredientAfterUpdate.status = false;
          await ingredientAfterUpdate.save({ session });
        }
      }
    }

    const newOrder = new Order({
      userId,
      voucherId: voucher?.voucherId || null,
      items: detailedItems,
      voucherDiscount: voucher?.discount || 0,
      delivery: {
        name: delivery.name,
        phone: delivery.phone,
        address: delivery.address || null,
        note: delivery.note || "",
        deliveryTime: delivery.deliveryTime || "Càng sớm càng tốt", 
      },
      orderType: "ONLINE",
      paymentMethod: "VNPAY",
      totalPrice: total,
      paymentStatus: "PENDING",
    });

    newOrder.vnp_TxnRef = newOrder._id.toString();
    await newOrder.save({ session });

    await session.commitTransaction();
    scheduleOrderCancellation(newOrder._id);

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
    });
  } catch (err) {
    await session.abortTransaction();
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
    const verify = vnpay.verifyReturnUrl(req.query);

    if (!verify.isVerified) {
      await session.abortTransaction();
      return res.redirect(
        `http://localhost:5173/payment-result?status=error&code=97&message=${encodeURIComponent(
          "Chữ ký không hợp lệ"
        )}`
      );
    }
    const orderId = verify.vnp_TxnRef;
    const orderCancle = await Order.findById(orderId).session(session);

    // Check order đã bị hủy hay chưa
    if (orderCancle.status === "CANCELLED") {
      await session.abortTransaction();
      return res.redirect(
        `http://localhost:5173/payment-result?&orderId=${orderCancle._id}`
      );
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.redirect(
        `http://localhost:5173/payment-result?status=error&code=01&message=${encodeURIComponent(
          "Không tìm thấy đơn hàng"
        )}`
      );
    }

    // Nếu thanh toán thất bại
    if (!verify.isSuccess) {
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

      order.paymentStatus = "FAILED";
      order.status = "CANCELLED";
      await order.save({ session });

      await session.commitTransaction();

      return res.redirect(
        `http://localhost:5173/payment-result?orderId=${order._id}`
      );
    }

    // thanh toán thành công
    order.paymentStatus = "SUCCESS";
    order.vnp_TransactionNo = verify.vnp_TransactionNo;
    order.vnp_Amount = verify.vnp_Amount;
    order.vnp_PayDate = verify.vnp_PayDate;

    // Cập nhật voucher nếu có
    if (order.voucherId) {
      await Voucher.findByIdAndUpdate(
        order.voucherId,
        { $inc: { usedCount: 1 } },
        { session }
      );
    }

    // clear cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { $set: { items: [] } },
      { session }
    );

    await order.save({ session });
    await session.commitTransaction();

    return res.redirect(
      `http://localhost:5173/payment-result?&orderId=${order._id}`
    );
  } catch (err) {
    await session.abortTransaction();
    return res.redirect(
      `http://localhost:5173/payment-result?status=error&message=${encodeURIComponent(
        "Xử lý callback thất bại"
      )}`
    );
  } finally {
    session.endSession();
  }
};