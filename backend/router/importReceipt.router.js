import express from "express";
import {
  createImportReceipt,
  getImportReceipts,
  getImportReceiptById,
  createExportReceipt
} from "../controllers/importReceipt/importReceipt.controller.js";
import { verifyToken, isAdminOrStaff } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/import", verifyToken, isAdminOrStaff, createImportReceipt);
router.post("/export", verifyToken, isAdminOrStaff, createExportReceipt);
router.get("/", verifyToken, isAdminOrStaff, getImportReceipts);
router.get("/:id", verifyToken, isAdminOrStaff, getImportReceiptById);

export default router;
