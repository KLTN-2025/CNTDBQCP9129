import express from "express"
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart/cart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", verifyToken, addToCart);
router.put("/:userId", verifyToken, updateCartItem);
router.delete("/:userId/item", verifyToken, removeCartItem);
router.delete("/:userId", verifyToken, clearCart);

export default router