import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0 
  },
  unit: {
    type: String,
    required: true,
    enum: ["g", "ml", "cái"]
  },
  totalCost: { // tổng tiền nhập kho
    type: Number,
    required: true,
    default: 0
  },
  perUnitCost: { // giá trên 1 đơn vị = totalCost / quantity nhập
    type: Number,
    required: true,
    default: 0
  },
  status: { 
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
export default Ingredient;
