import express from 'express';
import { cancelReservation, confirmReservation, createReservation, deleteReservation, getAllReservations } from '../controllers/reservation/reservation.controller.js';
import { verifyToken, isAdminOrStaff, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get("/", verifyToken, isAdminOrStaff, getAllReservations);
router.post("/", createReservation);
router.patch("/:id/confirm", verifyToken, isAdminOrStaff, confirmReservation);
router.patch("/:id/cancel", verifyToken, isAdminOrStaff, cancelReservation);
router.delete("/:id", verifyToken, isAdmin, deleteReservation);

export default router