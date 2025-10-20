import express from 'express';
import { forgotPassword, loginUser, registerUser, resetPassword, verifyEmail } from '../controllers/auth/auth.controller.js';
import { changePassword } from '../controllers/auth/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email', verifyEmail)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", verifyToken, changePassword);
export default router