import mongoose from "mongoose";
import slugify from "slugify"; // nhớ cài: npm install slugify

const blogCategorySchema = new mongoose.Schema(
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
blogCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default BlogCategory;
