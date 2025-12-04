import express from 'express'
import { getOrders } from '../controllers/order/order.controller.js';

const router = express.Router();
router.get('/', getOrders);
router.patch("/orders/:id/complete", isAdmin, completeOrder);
export default router