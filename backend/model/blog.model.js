import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "BlogCategory", 
    required: true 
  },
  createAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);
