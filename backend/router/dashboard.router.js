import express from 'express';
import { 
  getOverviewStats, 
  getRevenueStats, 
  getTopProducts, 
  getOrderTypeStats, 
  getOrderStatusStats 
} from '../controllers/dashboard/dashboard.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/overview', verifyToken, isAdmin, getOverviewStats);
router.get('/revenue', verifyToken, isAdmin, getRevenueStats);
router.get('/top-products', verifyToken, isAdmin, getTopProducts);
router.get('/order-type', verifyToken, isAdmin, getOrderTypeStats);
router.get('/order-status', verifyToken, isAdmin, getOrderStatusStats);

export default router;