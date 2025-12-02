import express from 'express'
import { createOrderOnline, getOrders } from '../controllers/order/order.controller.js';

const router = express.Router();
router.post('/', createOrderOnline);
router.get('/', getOrders);
export default router