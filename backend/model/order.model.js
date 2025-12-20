import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pagerNumber: {
      type: Number,
      default: null,
    },
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
    voucherDiscount: {
      type: Number,
      default: 0,
    },
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

    delivery: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
      address: { type: String, default: null },
      note: { type: String, default: "" },
      deliveryTime: { type: String, default: "Càng sớm càng tốt" }, 
    },

    orderType: { type: String, enum: ["ONLINE", "OFFLINE"], required: true },

    paymentMethod: { type: String, enum: ["CASH", "VNPAY"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    vnp_TxnRef: { type: String, default: null },
    vnp_TransactionNo: { type: String, default: null },
    vnp_PayDate: { type: String, default: null },
    vnp_Amount: { type: Number, default: null },

    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "CANCELLED"],
      default: "PROCESSING",
    },
  },
  { timestamps: true }
);

// Compound index để truy vấn nhanh userId + voucherCode
orderSchema.index({ userId: 1, voucherId: 1 });
const Order = mongoose.model("Order", orderSchema);
export default Order;