import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

// In-memory fallback vector store for local development or when Pinecone is unconfigured
const memoryVectorStore = [];

let pineconeIndex = null;
let pineconeInitialized = false;

const initPinecone = () => {
  if (pineconeInitialized) return pineconeIndex;
  pineconeInitialized = true;

  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (apiKey && indexName) {
    try {
      const pc = new Pinecone({ apiKey });
      pineconeIndex = pc.index(indexName);
      console.log("Pinecone client initialized successfully.");
    } catch (err) {
      console.warn("Pinecone initialization failed, using in-memory store:", err.message);
    }
  } else {
    console.log("Pinecone credentials missing; running with in-memory semantic store.");
  }

  return pineconeIndex;
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
};

export const saveEmbedding = async (text, embedding, id = Date.now().toString()) => {
  // Always cache in memory
  memoryVectorStore.push({ id, text, embedding });

  const index = initPinecone();
  if (index) {
    try {
      await index.upsert([
        {
          id,
          values: embedding,
          metadata: { text },
        },
      ]);
      console.log("Saved to Pinecone:", id);
      return;
    } catch (error) {
      console.warn("Pinecone Save Warning, fallback stored in-memory:", error.message);
    }
  }
};

export const searchEmbedding = async (queryEmbedding, topK = 3) => {
  const index = initPinecone();

  if (index) {
    try {
      const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      if (results.matches && results.matches.length > 0) {
        return results.matches.map((m) => ({
          text: m.metadata?.text || "",
          score: m.score,
        }));
      }
    } catch (error) {
      console.warn("Pinecone Query Warning, searching in-memory cache:", error.message);
    }
  }

  // Fallback search against memoryVectorStore
  if (memoryVectorStore.length === 0) {
    return [];
  }

  const scored = memoryVectorStore.map((item) => ({
    text: item.text,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
};
