import { ragQuery } from "../services/ragService.js";
import { detectCrisis } from "../services/crisisDetectionService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const crisisStatus = detectCrisis(message);
    const reply = await ragQuery(message);

    return res.status(200).json({
      reply,
      isCrisis: crisisStatus.isCrisis,
      helplines: crisisStatus.isCrisis ? crisisStatus.helplines : [],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
};
