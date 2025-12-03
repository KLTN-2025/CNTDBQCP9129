import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import Product from "../../model/product.model.js";
import { calculateVoucherDiscount } from '../voucher/voucher.controller.js';

const vnpay = new VNPay({
  tmnCode: '6Z3TSPO9',
  secureSecret: '40YYRRUMS9DEF74CWS38QO5DL68TOUI5',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  enableLog: true,
  loggerFn: ignoreLogger,
});

// Helper: Chuyển IPv6 localhost thành IPv4
const getIPv4 = (ip) => {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  // Loại bỏ IPv6 prefix nếu có
  return ip.replace('::ffff:', '');
};

export const createPayment = async (req, res) => {
  try {
    const { cartItems, userId, delivery, voucherCode } = req.body;

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Tính tổng
    let total = 0;
    const detailedItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm không tồn tại` });
      }
      const itemTotal = product.price * (1 - product.discount / 100) * item.quantity;
      total += itemTotal;

      detailedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price * (1 - product.discount / 100),
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
        items: cartItems.map(i => i.productId.productCategoryId),
        total,
        userId,
      });
      console.log("discount", result.discount);
      discount = result.discount;
      voucherId = result.voucherId;
      total -= discount;
      if (total < 0) total = 0;
    }

    // Làm tròn total
    total = Math.round(total);

    const orderData = {
      userId,
      voucherId,
      items: detailedItems,
      voucherDiscount: discount,
      delivery,
      orderType: "ONLINE",
      paymentMethod: "VNPAY",
      totalPrice: total,
    };

    // Tạo txnRef unique
    const txnRef = Date.now().toString();

    // LƯU Ý: Nên lưu orderData vào database hoặc Redis với key = txnRef
    // để sau này callback có thể lấy ra xử lý
    // Ví dụ: await redis.setex(txnRef, 900, JSON.stringify(orderData));

    // Tạo URL thanh toán
    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: total,  
      vnp_IpAddr: getIPv4(req.ip || '127.0.0.1'),
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${txnRef}`, 
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:5000/api/payment/ipn',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
    });

    return res.status(200).json({
      vnpUrl: vnpayResponse,
      txnRef,
      total,
      shippingFee,
      discount,
      items: detailedItems,
    });

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ 
      message: "Tạo thanh toán thất bại", 
      error: err.message 
    });
  }
};

export const handleVnpayReturn = async (req, res) => {
  try {
    console.log(" VNPay callback received:", req.query);

    // Verify chữ ký từ VNPay
    const verify = vnpay.verifyReturnUrl(req.query);
    
    if (!verify.isVerified) {
      return res.status(400).json({ 
        message: "Chữ ký không hợp lệ",
        code: '97' 
      });
    }

    if (!verify.isSuccess) {
      return res.status(400).json({ 
        message: "Giao dịch thất bại",
        code: verify.vnp_ResponseCode 
      });
    }

    // Lấy thông tin đơn hàng từ txnRef
    const txnRef = verify.vnp_TxnRef;
    // const orderData = await redis.get(txnRef); // Lấy từ cache/DB

    // TODO: Lưu order vào database
    // const order = await Order.create({...orderData, status: 'PAID'});

    return res.status(200).json({
      message: "Thanh toán thành công",
      code: '00',
      txnRef: verify.vnp_TxnRef,
      amount: verify.vnp_Amount,
      bankCode: verify.vnp_BankCode,
      transactionNo: verify.vnp_TransactionNo,
    });

  } catch (err) {
    console.error(" VNPAY CALLBACK ERROR:", err);
    res.status(500).json({ 
      message: "Xử lý callback thất bại",
      error: err.message 
    });
  }
};