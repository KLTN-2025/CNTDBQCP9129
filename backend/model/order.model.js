import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // Ai tạo đơn
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Danh sách món
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true }, // lưu tên sản phẩm tại thời điểm order
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // giá tại thời điểm order
    },
  ],
  // Thông tin giao hàng
  delivery: {
    type: {
      name: String,
      phone: String,
      address: String,
      note: { type: String, default: "" },
    },
    default: null,
  },
  // Tổng tiền
  totalPrice: { type: Number, required: true },

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

  // Phân biệt loại order
  orderType: { type: String, enum: ["ONLINE", "OFFLINE"], required: true },

  // Trạng thái đơn hàng
  status: {
    type: String,
    enum: [
      "PENDING",
      "CONFIRMED",
      "PAID",
      "PROCESSING",
      "COMPLETED",
      "CANCELLED",
    ],
    default: "PENDING",
  },

  // Thời gian tạo đơn
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
