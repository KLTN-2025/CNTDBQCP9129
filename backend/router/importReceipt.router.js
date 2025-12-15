import express from "express";
import {
  createImportReceipt,
  getImportReceipts,
  getImportReceiptById,
  getReceiptsByDateRange,
  createExportReceipt
} from "../controllers/importReceipt/importReceipt.controller.js";

const router = express.Router();
router.post("/import", createImportReceipt);
router.post("/export", createExportReceipt);
router.get("/", getImportReceipts);
router.get("/getByDate", getReceiptsByDateRange);
router.get("/:id", getImportReceiptById);

export default router;
