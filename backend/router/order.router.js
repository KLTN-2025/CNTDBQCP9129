import express from 'express'
import { completeOrder, getAllOrdersByUserId, getOrderById, getOrders, getPendingOrders, getSuccessOrders } from '../controllers/order/order.controller.js';

const router = express.Router();
router.get('/', getOrders);
router.get("/pending", getPendingOrders);
router.get("/success", getSuccessOrders);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getAllOrdersByUserId);
router.patch("/:id/complete", completeOrder);
export default router;