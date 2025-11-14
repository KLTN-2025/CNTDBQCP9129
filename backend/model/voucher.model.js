import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  discountType: {
    type: String,
    enum: ["percent", "amount"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 0, // 0 nghĩa là không giới hạn
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1, // mỗi user dùng tối đa 1 lần
  },
  conditions: {
    minOrderValue: { type: Number, default: 0 },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" }],
    maxDiscountAmount: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"], 
    default: "active",
  },
}, { timestamps: true });

export default mongoose.model("Voucher", voucherSchema);
