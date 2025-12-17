import express from 'express'
import { completeOrder, createOrderOffline, getAllOrdersByUserId, getOrderById, getOrders} from '../controllers/order/order.controller.js';
import { verifyToken, isAdminOrStaff } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get('/', verifyToken, isAdminOrStaff, getOrders);
router.get('/:orderId', verifyToken, getOrderById);
router.get('/user/:userId', verifyToken, getAllOrdersByUserId);
router.post('/', verifyToken, isAdminOrStaff, createOrderOffline); 
router.patch("/:id/complete", verifyToken, isAdminOrStaff, completeOrder);
export default router;