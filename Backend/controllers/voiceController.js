import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { transcribeAudioFile } from "../services/transcriptionService.js";

export const handleVoiceToText = async (req, res) => {
  let tempFilePath = null;

  try {
    const audioFile = req.files.audio;

    // Generate unique filename in OS temp dir to prevent race collisions
    const uniqueId = crypto.randomUUID();
    const extension = path.extname(audioFile.name || "") || ".webm";
    tempFilePath = path.join(os.tmpdir(), `mindful_voice_${uniqueId}${extension}`);

    // Move file to unique temp location
    await audioFile.mv(tempFilePath);

    // Transcribe via service
    const text = await transcribeAudioFile(tempFilePath);

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Voice transcription error:", error.message);
    const statusCode = error.message.includes("not configured") ? 503 : 500;
    return res.status(statusCode).json({
      error: "Voice-to-text transcription failed.",
      details: error.message,
    });

  } finally {
    // Guaranteed cleanup of temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupErr) {
        console.warn("Failed to delete temp file:", cleanupErr.message);
      }
    }
  }
};
