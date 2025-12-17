import express from 'express'
import { getAdmins, getAllUsers, getManagers, updateUserRole } from '../controllers/user/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', verifyToken, isAdmin, getAllUsers);
router.get('/role/manager', verifyToken, isAdmin, getManagers);
router.get('/role/admin', verifyToken, isAdmin, getAdmins);
router.patch('/:id', verifyToken, isAdmin, updateUserRole);
export default router;