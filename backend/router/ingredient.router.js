import express from "express";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  toggleIngredientStatus,
  updateIngredient,
} from "../controllers/ingredient/ingredient.controller.js";

const router = express.Router();

router.get("/", getAllIngredients);
router.post("/", createIngredient);
router.put("/:id", updateIngredient);
router.delete("/:id", deleteIngredient);
router.patch("/:id", toggleIngredientStatus);
export default router;
