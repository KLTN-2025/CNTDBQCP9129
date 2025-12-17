// routes/dashboard.route.js
import express from 'express';
import { 
  getOverviewStats, 
  getRevenueStats, 
  getTopProducts, 
  getOrderTypeStats, 
  getOrderStatusStats 
} from '../controllers/dashboard/dashboard.controller.js';
import { verifyToken, isAdminOrStaff } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/overview', verifyToken, isAdminOrStaff, getOverviewStats);
router.get('/revenue', verifyToken, isAdminOrStaff, getRevenueStats);
router.get('/top-products', verifyToken, isAdminOrStaff, getTopProducts);
router.get('/order-type', verifyToken, isAdminOrStaff, getOrderTypeStats);
router.get('/order-status', verifyToken, isAdminOrStaff, getOrderStatusStats);

export default router;