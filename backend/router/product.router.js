import express from "express";
import { createProduct, deleteProduct, getProductsByCategory, updateProduct } from "../controllers/product/product.controller.js";
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", verifyToken, isAdmin, createProduct);
router.get("/:slugCategory", getProductsByCategory);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);


export default router;
