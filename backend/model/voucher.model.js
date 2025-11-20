import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
  },
  description: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percent", "amount"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 1
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
    required: true,
    min: 1 
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    required: true,
    min: 0 
  },
  image: {
    type: String,
    required: true,
  },
  conditions: {
    minOrderValue: { type: Number, required: true, min: 0 },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" }],
    maxDiscountAmount: { type: Number, default: null},
  },
  status: {
    type: String,
    enum: ["active", "inactive"], 
    default: "active",
  },
}, { timestamps: true });

export default mongoose.model("Voucher", voucherSchema);
