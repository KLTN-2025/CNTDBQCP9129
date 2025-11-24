import express from 'express';
import { applyVoucher, createVoucher, deactivateVoucher, deleteVoucher, getAvailableVouchers, getVouchers } from '../controllers/voucher/voucher.controller.js';

const router = express.Router();

router.post('/', createVoucher);
router.get('/', getVouchers);
router.post('/check-voucher', applyVoucher);
router.get('/availableVouchers', getAvailableVouchers);
router.patch('/deactivateVoucher/:id', deactivateVoucher);
router.delete('/deleteVoucher/:id', deleteVoucher);
export default router;