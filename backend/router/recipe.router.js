import express from 'express';
import { createRecipe, deleteRecipe, getAllRecipes, updateRecipe } from '../controllers/recipe/recipe.controller.js';

const router = express.Router();


router.get('/', getAllRecipes);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router