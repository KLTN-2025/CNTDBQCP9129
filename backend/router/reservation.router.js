import express from 'express';
import { cancelReservation, confirmReservation, createReservation, deleteReservation, getAllReservations } from '../controllers/reservation/reservation.controller.js';

const router = express.Router();
router.get("/", getAllReservations);
router.post("/", createReservation);
router.patch("/:id/confirm", confirmReservation);
router.patch("/:id/cancel", cancelReservation);
router.delete("/:id", deleteReservation);

export default router