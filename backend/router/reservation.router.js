import express from 'express';
import { cancelReservation, confirmReservation, createReservation, deleteReservation } from '../controllers/reservation/reservation.controller.js';

const router = express.Router();

router.post("/", createReservation);
router.patch("/:id/confirm", confirmReservation);
router.patch("/:id/cancel", cancelReservation);
router.delete("/:id", deleteReservation);

export default router