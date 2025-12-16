import express from 'express'
import { completeOrder, createOrderOffline, getAllOrdersByUserId, getOrderById, getOrders} from '../controllers/order/order.controller.js';

const router = express.Router();
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getAllOrdersByUserId);
router.post('/', createOrderOffline); 
router.patch("/:id/complete", completeOrder);
export default router;