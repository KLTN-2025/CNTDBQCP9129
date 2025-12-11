import express from "express";
import {
  createImportReceipt,
  getImportReceipts,
  getImportReceiptById
} from "../controllers/importReceipt/importReceipt.controller.js";

const router = express.Router();
router.post("/", createImportReceipt);
router.get("/", getImportReceipts);
router.get("/:id", getImportReceiptById);

export default router;
