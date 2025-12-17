import express from 'express'
import { createContact, deleteContact, getAllContacts, getReadContacts, getUnreadContacts, markAsRead } from '../controllers/contact/contact.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', verifyToken, isAdmin, getAllContacts);
router.post('/', createContact);
router.delete('/:id', verifyToken, isAdmin, deleteContact);
router.put("/read/:id", verifyToken, isAdmin, markAsRead);
router.get("/read", verifyToken, isAdmin, getReadContacts);
router.get("/unread", verifyToken, isAdmin, getUnreadContacts);
export default router