import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  updateBlog,
  deleteBlog,
  getRandomBlogs,
} from "../controllers/blog/blog.controller.js";
import { verifyToken, isAdminOrStaff } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/random", getRandomBlogs)
router.get("/:slugCategory/:slug", getBlogBySlug);
router.get("/:slugCategory", getBlogsByCategory);
router.post("/", verifyToken, isAdminOrStaff, createBlog);
router.put("/:id", verifyToken, isAdminOrStaff, updateBlog);
router.delete("/:id", verifyToken, isAdminOrStaff, deleteBlog);

export default router;
