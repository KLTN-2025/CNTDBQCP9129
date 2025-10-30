import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/product/productCategory.controller.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;