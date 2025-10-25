import mongoose from "mongoose";
import slugify from "slugify"; // npm install slugify

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    // Ảnh chính
    mainImage: { type: String, required: true, trim: true },

    // Ảnh phụ (nhiều ảnh)
    subImages: [{ type: String, trim: true }],

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

// 🧠 Tự động tạo slug từ title (chạy trước khi save)
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Blog", blogSchema);
