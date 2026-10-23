import express from "express";
import { handleVoiceToText } from "../controllers/voiceController.js";
import { validateAudioUpload } from "../middlewares/uploadValidator.js";

const router = express.Router();

router.post("/voice-to-text", validateAudioUpload, handleVoiceToText);

export default router;
