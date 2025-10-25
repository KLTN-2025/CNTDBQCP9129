import express from "express";
import upload from "../middleware/uploadImage.middleware.js"
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog/blog.controller.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.post("/", upload.array("images", 3), createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
