import express from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/blog/blogCategory.controller.js';
const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;