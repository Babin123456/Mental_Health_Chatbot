import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { generateEmbedding } from "./embeddingService.js";
import { searchEmbedding } from "./vectorStore.js";

const apiKey = process.env.GOOGLE_API_KEY || "dummy_key";
const genAI = new GoogleGenerativeAI(apiKey);

// Chat model
const chatModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Keywords to skip RAG
const creativeKeywords = [
  "joke", "shayari", "poem", "story", "quote",
  "funny", "motivate", "poetry", "motivation"
];

export const ragQuery = async (query) => {
  try {
    if (!query || typeof query !== "string") {
      return "Hello! I am here to listen and help. What is on your mind today?";
    }

    // Skip RAG for creative requests
    if (creativeKeywords.some(k => query.toLowerCase().includes(k))) {
      const aiRes = await chatModel.generateContent(query);
      return aiRes.response.text();
    }

    let context = "";
    try {
      const queryEmbedding = await generateEmbedding(query);
      const results = await searchEmbedding(queryEmbedding);
      context = results.map(r => r.text).join("\n");
    } catch (embErr) {
      console.warn("Embedding / vector search fallback:", embErr.message);
    }

    const prompt = `
You are MindFul, a friendly, supportive mental health assistant.
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
    return "I am here with you and listening. I'm facing a slight connection delay, but please feel free to continue sharing.";
  }
};
