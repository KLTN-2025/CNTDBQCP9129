import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Ai tạo đơn
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Voucher áp dụng (nếu có)
     voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
    // Danh sách món
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        note: { type: String, default: "" },
      },
    ],

    totalPrice: { type: Number, required: true },

    // Thông tin giao hàng
    delivery: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: null },
      note: { type: String, default: "" },
    },

    orderType: { type: String, enum: ["ONLINE", "OFFLINE"], required: true },

    // Phương thức thanh toán
    paymentMethod: { type: String, enum: ["CASH", "VNPAY"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    // Thông tin VNPAY (nếu thanh toán online)
    vnp_TxnRef: { type: String, default: null },
    vnp_TransactionNo: { type: String, default: null },
    vnp_PayDate: { type: String, default: null },
    vnp_Amount: { type: Number, default: null },

    // Trạng thái đơn hàng
    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Compound index để truy vấn nhanh userId + voucherCode
orderSchema.index({ userId: 1, voucherCode: 1 });
const Order = mongoose.model("Order", orderSchema);
export default Order;
