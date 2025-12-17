import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  toggleIngredientStatus,
  updateIngredient,
} from "../controllers/ingredient/ingredient.controller.js";
import { verifyToken, isAdminOrStaff, isAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", verifyToken, isAdminOrStaff, getAllIngredients);
router.post("/", verifyToken, isAdminOrStaff, createIngredient);
router.put("/:id", verifyToken, isAdmin, updateIngredient);
router.delete("/:id", verifyToken, isAdmin, deleteIngredient);
router.patch("/:id", verifyToken, isAdminOrStaff, toggleIngredientStatus);
export default router;
