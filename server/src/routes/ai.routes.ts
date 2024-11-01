import express from "express";
import { sendMessageToAI, validateInputForAI } from "../controllers/ai.controller";

const router = express.Router();

router.post("/chat", validateInputForAI, sendMessageToAI);

export default router;
