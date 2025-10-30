import mongoose from "mongoose";
import slugify from "slugify"; // nhớ cài: npm install slugify

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
  },
  { timestamps: true }
);

// 🧠 Tự động tạo slug từ name mỗi khi tạo hoặc sửa name
productCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

const ProductCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default ProductCategory;
