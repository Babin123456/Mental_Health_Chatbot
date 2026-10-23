import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadDatasetFile, chunkText } from "../services/fileLoader.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { saveEmbedding } from "../services/vectorStore.js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Loading mental health datasets for RAG...");

  const datasetDir = path.join(__dirname, "../dataset");

  const files = [
    "family_style_emotional_support_dataset.jsonl",
    "playful_teasing_dataset_hinglish.jsonl",
    "therapy_dataset_v3.jsonl",
    "tough_love_dataset_hinglish.jsonl",
    "intent.jsonl",
    "mentalhealth.json",
    "supportive_mental_health_dataset_10000.json",
  ];

  let allEntries = [];

  for (const file of files) {
    const fullPath = path.join(datasetDir, file);
    if (fs.existsSync(fullPath)) {
      const entries = loadDatasetFile(fullPath);
      console.log(`Loaded ${entries.length} items from ${file}`);
      allEntries = allEntries.concat(entries);
    } else {
      console.warn(`File skipped (not found): ${file}`);
    }
  }

  console.log(`Total dataset items loaded: ${allEntries.length}`);

  // Combine sample entries and chunk
  const sampleEntries = allEntries.slice(0, 100);
  const combinedText = sampleEntries.join("\n\n");
  const chunks = chunkText(combinedText, 400);

  console.log(`Generated ${chunks.length} text chunks for embedding ingestion.`);

  const maxChunks = Math.min(chunks.length, 25);
  for (let i = 0; i < maxChunks; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i + 1}/${maxChunks}...`);

    try {
      const embedding = await generateEmbedding(chunk);
      await saveEmbedding(chunk, embedding, `chunk-${i}`);
    } catch (err) {
      console.warn(`Could not process chunk ${i}:`, err.message);
    }
  }

  console.log("Dataset preparation and ingestion completed!");
}

run().catch((err) => console.error("Ingestion script error:", err));
