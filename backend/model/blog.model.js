import mongoose from "mongoose";
import slugify from "slugify"; 

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    // Gộp tất cả ảnh (ảnh chính, ảnh phụ) vào 1 mảng
    images: [{ type: String, trim: true, required: true }],

    // Nội dung chia 3 phần
    content: {
      intro: {
        text: { type: String, required: true, trim: true },
        highlight: { type: String, trim: true },
      },
      body: {
        text: { type: String, required: true, trim: true },
        highlight: { type: String, trim: true },
      },
      conclusion: {
        text: { type: String, required: true, trim: true },
        highlight: { type: String, trim: true },
      },
    },
  },
  { timestamps: true }
);

// 🧠 Tự động tạo slug từ title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: "vi" });
  }
  next();
});

export default mongoose.model("Blog", blogSchema);
