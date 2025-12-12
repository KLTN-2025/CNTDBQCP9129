import express from "express";
import {
  createImportReceipt,
  getImportReceipts,
  getImportReceiptById,
  getReceiptsByDateRange
} from "../controllers/importReceipt/importReceipt.controller.js";

const router = express.Router();
router.post("/", createImportReceipt);
router.get("/", getImportReceipts);
router.get("/getByDate", getReceiptsByDateRange);
router.get("/:id", getImportReceiptById);

export default router;
