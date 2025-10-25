import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  updateBlog,
  deleteBlog,
} from "../controllers/blog/blog.controller.js";
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:slugCategory/:slug", getBlogBySlug);
router.get("/:slugCategory", getBlogsByCategory);
router.post("/", createBlog);
router.put("/:id", verifyToken, isAdmin, updateBlog);
router.delete("/:id", verifyToken, isAdmin, deleteBlog);

export default router;
