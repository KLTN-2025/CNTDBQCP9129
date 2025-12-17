import express from 'express';
import { applyVoucher, createVoucher, deactivateVoucher, deleteVoucher, getAvailableVouchers, getVouchers } from '../controllers/voucher/voucher.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/', verifyToken, isAdmin, createVoucher);
router.get('/', getVouchers);
router.post('/check-voucher', verifyToken, applyVoucher);
router.get('/availableVouchers', getAvailableVouchers);
router.patch('/deactivateVoucher/:id', verifyToken, isAdmin, deactivateVoucher);
router.delete('/deleteVoucher/:id', verifyToken, isAdmin, deleteVoucher);
export default router;