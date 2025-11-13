import express from 'express'
import { getAllUsers, updateUserRole } from '../controllers/user/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', getAllUsers);
router.patch('/:id', updateUserRole);
export default router;