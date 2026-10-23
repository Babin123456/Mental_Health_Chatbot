import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { searchEmbedding } from "./vectorStore.js";
import { detectCrisis } from "./crisisDetectionService.js";
import { sanitizeInput } from "../utils/safetySanitizer.js";

const apiKey = process.env.GOOGLE_API_KEY || "dummy_key";
const genAI = new GoogleGenerativeAI(apiKey);

// Embedding model
const embedder = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

// Chat model
const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Keywords to skip RAG
const creativeKeywords = [
  "joke", "shayari", "poem", "story", "quote",
  "funny", "motivate", "poetry", "motivation"
];

export const ragQuery = async (rawQuery) => {
  try {
    const query = sanitizeInput(rawQuery);

    // Crisis Safety Guardrail
    const crisisCheck = detectCrisis(query);
    if (crisisCheck.isCrisis) {
      const topHelpline = crisisCheck.helplines[0];
      const helplineDetails = topHelpline
        ? `\n\nImmediate Resources:\n- ${topHelpline.name}: Call ${topHelpline.phone} (${topHelpline.available})\n- Tele-MANAS: Call 14416 (24/7 Toll-Free)\n- 988 Lifeline: Call or text 988`
        : "\n\nPlease dial 14416 (Tele-MANAS) or 988 immediately.";

      return `${crisisCheck.interventionMessage}${helplineDetails}\n\nYou do not have to carry this alone. Please reach out to someone who can help right now.`;
    }

    // Skip RAG for creative requests
    if (creativeKeywords.some(k => query.toLowerCase().includes(k))) {
      const aiRes = await chatModel.generateContent(query);
      return aiRes.response.text();
    }

    let context = "";
    try {
      const embedRes = await embedder.embedContent(query);
      const queryEmbedding = embedRes.embedding.values;
      const results = await searchEmbedding(queryEmbedding);
      context = results.map(r => r.text).join("\n");
    } catch (embErr) {
      console.warn("Embedding search skipped/fallback:", embErr.message);
    }

    const prompt = `
You are a friendly, supportive mental health assistant.
Use the context ONLY if relevant. Otherwise answer normally.

Context:
${context}

User: ${query}

Reply kindly in 2–3 lines.
`;

    const aiRes = await chatModel.generateContent(prompt);
    return aiRes.response.text();

  } catch (error) {
    console.error("RAG Error:", error);
    return "I am here with you and listening. I'm having a brief connection issue, but please feel free to continue sharing what you're experiencing.";
  }
};
