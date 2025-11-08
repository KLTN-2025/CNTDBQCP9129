import express from "express"
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addToCart);
router.put("/:userId", updateCartItem);
router.delete("/:userId/item", removeCartItem);
router.delete("/:userId", clearCart);

export default router