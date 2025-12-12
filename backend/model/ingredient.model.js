import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  unit: {
    type: String,
    required: true,
    enum: ["g", "ml", "cái"]
  },
  quantity: {         // tồn kho hiện tại
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  lastPrice: {        // giá gần nhất (đơn giá)
    type: Number,
    default: 0,
    min: 0,
  },
  totalCost: {        // tổng tiền tồn kho = sum of costs (để báo cáo nhanh)
    type: Number,
    default: 0,
    min: 0
  },
  
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
