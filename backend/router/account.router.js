import express from 'express';
import { createUser } from '../controllers/user/userController.js';
const router = express.Router();
router.post('/register', createUser);
export default router