import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductsByCategory,
  updateProduct,
  getLimitedProducts,
  getAllProducts,
  updateProductStatus,
  getTopSellingProducts
} from "../controllers/product/product.controller.js";

import {
  verifyToken,
  isAdmin,
  isAdminOrStaff
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/limit", getLimitedProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/:slugCategory", getProductsByCategory);
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.patch("/:id", verifyToken, isAdminOrStaff, updateProductStatus);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
