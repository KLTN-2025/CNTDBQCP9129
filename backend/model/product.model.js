import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number, 
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
