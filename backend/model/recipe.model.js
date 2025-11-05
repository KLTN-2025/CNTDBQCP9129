import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    // liên kết tới bảng Product (món nước)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true
    },
    items: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unit: {
          type: String,
          enum: ["g", "ml", "cái"],
          required: true,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
