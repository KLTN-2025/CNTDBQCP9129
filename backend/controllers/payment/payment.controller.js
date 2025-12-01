// controllers/payment.controller.js
import crypto from "crypto";
import qs from "qs";
import { createOrder } from "../order/order.controller.js";
import axios from "axios"; // dùng cho refund VNPAY

// ===== Tạo QR VNPAY =====
export const createPayment = async (req, res) => {
  try {
    const { items, total, orderType, userId } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Giỏ hàng trống" });

    const vnpUrl = createVnpayUrl({ amount: total, orderInfo: "Thanh toán đơn hàng", orderType, userId });
    res.status(200).json({ vnpUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo QR thất bại" });
  }
};

// ===== Callback IPN =====
export const handleVnpayIPN = async (req, res) => {
  try {
    const { userId, items, delivery, orderType, paymentMethod, voucherId, total, vnpInfo } = req.body;

    // Khi IPN về → gọi createOrder
    await createOrder({
      body: { userId, items, delivery, orderType, paymentMethod, voucherId, total, vnpInfo },
      io: req.io,
    }, res);

  } catch (err) {
    console.error(err);

    // Nếu lỗi do nguyên liệu không đủ → refund VNPAY
    if (err.message.includes("nguyên liệu không đủ")) {
      try {
        await refundVnpay(vnpInfo.vnp_TxnRef, vnpInfo.vnp_Amount);
        return res.status(400).json({ message: "Nguyên liệu không đủ, tiền đã được hoàn về" });
      } catch (refundErr) {
        console.error("Refund thất bại:", refundErr);
        return res.status(500).json({ message: "Nguyên liệu không đủ, refund thất bại" });
      }
    }

    res.status(500).json({ message: "Xử lý IPN thất bại" });
  }
};

// ===== Utils tạo URL VNPAY =====
export const createVnpayUrl = ({ amount, orderInfo, orderType, userId }) => {
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURNURL;

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:]/g, "").slice(0, 14);
  const orderId = Date.now();

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
    vnp_CreateDate: createDate,
  };

  const sortedParams = {};
  Object.keys(vnp_Params).sort().forEach(key => { sortedParams[key] = vnp_Params[key]; });

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(signData).digest("hex");
  return `${vnpUrl}?${qs.stringify(sortedParams)}&vnp_SecureHash=${secureHash}`;
};

// ===== Utils refund VNPAY =====
export const refundVnpay = async (txnRef, amount) => {
  const refundUrl = process.env.VNP_REFUND_URL;
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;

  const refundParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "refund",
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: txnRef,
    vnp_Amount: amount * 100,
    vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, "").slice(0, 14),
  };

  const sortedParams = {};
  Object.keys(refundParams).sort().forEach(key => { sortedParams[key] = refundParams[key]; });

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(signData).digest("hex");

  sortedParams.vnp_SecureHash = secureHash;

  const res = await axios.post(refundUrl, null, { params: sortedParams });
  if (res.data.RspCode !== "00") throw new Error("Refund thất bại VNPAY");
  return res.data;
};
