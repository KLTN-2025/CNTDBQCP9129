import express from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/blog/blogCategory.controller.js';
import { verifyToken, isAdminOrStaff } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyToken, isAdminOrStaff, createCategory);
router.put('/:id', verifyToken, isAdminOrStaff, updateCategory);
router.delete('/:id', verifyToken, isAdminOrStaff, deleteCategory);

export default router;