import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

let embedderInstance = null;

const getEmbedder = () => {
  if (!embedderInstance) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_API_KEY is not set in environment.");
      return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    embedderInstance = genAI.getGenerativeModel({ model: "text-embedding-004" });
  }
  return embedderInstance;
};

export const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required for embedding generation.");
  }

  const embedder = getEmbedder();
  if (!embedder) {
    throw new Error("Google Generative AI embedder is not initialized.");
  }

  const cleanText = text.slice(0, 2048);
  const result = await embedder.embedContent(cleanText);
  return result.embedding.values;
};

export const generateBatchEmbeddings = async (chunks, delayMs = 300) => {
  const embeddings = [];
  for (let i = 0; i < chunks.length; i++) {
    try {
      const emb = await generateEmbedding(chunks[i]);
      embeddings.push({ chunk: chunks[i], embedding: emb, index: i });
      if (delayMs > 0 && i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (err) {
      console.error(`Failed to embed chunk ${i}:`, err.message);
    }
  }
  return embeddings;
};
