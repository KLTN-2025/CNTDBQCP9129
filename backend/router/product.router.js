import express from "express";
import { createProduct, deleteProduct, getProductsByCategory, updateProduct, getLimitedProducts, getAllProducts, updateProductStatus } from "../controllers/product/product.controller.js";
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", getAllProducts);
router.get("/limit", getLimitedProducts);
router.get("/:slugCategory", getProductsByCategory);
router.post("/", verifyToken, isAdmin, createProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.patch("/:id", verifyToken, isAdmin, updateProductStatus);

export default router;
