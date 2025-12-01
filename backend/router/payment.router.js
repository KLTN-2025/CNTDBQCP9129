import express from 'express';
import { createPayment, handleVnpayIPN } from '../controllers/payment/payment.controller.js';

const router = express.Router();
router.post("/create", createPayment);
router.post("/ipn", handleVnpayIPN);
export default router;