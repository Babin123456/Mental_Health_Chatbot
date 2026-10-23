import express from "express";
import {
  logMood,
  getMoodHistory,
  getWeeklyMoodSummary,
} from "../controllers/moodController.js";

const router = express.Router();

router.post("/", logMood);
router.get("/history", getMoodHistory);
router.get("/summary", getWeeklyMoodSummary);

export default router;
