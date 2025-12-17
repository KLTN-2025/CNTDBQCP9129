import express from 'express';
import { createRecipe, deleteRecipe, getAllRecipes, updateRecipe } from '../controllers/recipe/recipe.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();


router.get('/', verifyToken, isAdmin, getAllRecipes);
router.post('/', verifyToken, isAdmin, createRecipe);
router.put('/:id', verifyToken, isAdmin, updateRecipe);
router.delete('/:id', verifyToken, isAdmin, deleteRecipe);

export default router