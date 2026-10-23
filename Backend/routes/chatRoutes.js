import express from "express";
import {
  sendMessage,
  getSessions,
  getSessionHistory,
  createSession,
  deleteSession,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/message", sendMessage);
router.get("/sessions", getSessions);
router.post("/session", createSession);
router.get("/history/:sessionId", getSessionHistory);
router.delete("/session/:sessionId", deleteSession);

export default router;