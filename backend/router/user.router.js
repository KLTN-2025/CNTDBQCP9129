import express from 'express'
import { getAdmins, getAllUsers, getManagers, updateUserRole } from '../controllers/user/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', getAllUsers);
router.get('/role/manager', getManagers);
router.get('/role/admin', getAdmins);
router.patch('/:id', updateUserRole);
export default router;