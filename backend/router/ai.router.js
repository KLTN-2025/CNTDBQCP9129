import express from "express";
import { chatAI } from "../controllers/ai/ai.controller.js";

const router = express.Router();

router.post("/chat", chatAI);

export default router;