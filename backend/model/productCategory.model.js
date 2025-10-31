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
    image: { type: String, trim: true, required: true, unique: true },

  },
  { timestamps: true }
);

//  Tự động tạo slug từ name mỗi khi tạo hoặc sửa name
productCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);
export default ProductCategory;
