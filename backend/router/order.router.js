import express from 'express'
import { completeOrder, getOrders } from '../controllers/order/order.controller.js';

const router = express.Router();
router.get('/', getOrders);
router.patch("/orders/:id/complete", completeOrder);
export default router;