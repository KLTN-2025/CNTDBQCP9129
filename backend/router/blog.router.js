import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  updateBlog,
  deleteBlog,
} from "../controllers/blog/blog.controller.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:slugCategory/:slug", getBlogBySlug);
router.get("/:slugCategory", getBlogsByCategory);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
