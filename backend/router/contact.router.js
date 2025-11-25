import express from 'express'
import { createContact, deleteContact, getAllContacts, getReadContacts, getUnreadContacts, markAsRead } from '../controllers/contact/contact.controller.js';

const router = express.Router();
router.get('/', getAllContacts);
router.post('/', createContact);
router.delete('/:id', deleteContact);
router.put("/read/:id", markAsRead);
router.get("/read", getReadContacts);
router.get("/unread", getUnreadContacts);
export default router