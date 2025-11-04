import express from "express";
import { createProduct, deleteProduct, getProductsByCategory, updateProduct } from "../controllers/product/product.controller.js";
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", createProduct);
router.get("/:slugCategory", getProductsByCategory);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);


export default router;
