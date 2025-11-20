import express from 'express';
import { applyVoucher, createVoucher, getAvailableVouchers, getVouchers } from '../controllers/voucher/voucher.controller.js';

const router = express.Router();

router.post('/', createVoucher);
router.get('/', getVouchers);
router.post('/check-voucher', applyVoucher);
router.get('/availableVouchers', getAvailableVouchers);
export default router;