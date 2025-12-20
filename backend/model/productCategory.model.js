import mongoose from "mongoose";
import slugify from "slugify";

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    image: { type: String, trim: true, required: true },

  },
  { timestamps: true }
);
productCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);
export default ProductCategory;
