import express from 'express';
import { createPayment, handleVnpayReturn } from '../controllers/payment/payment.controller.js';

const router = express.Router();
router.post("/create", createPayment);
router.get("/ipn", handleVnpayReturn);
export default router;