import fs from "fs";

export function loadDatasetFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Dataset file not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) return [];

  // Check if it's standard JSON
  if (filePath.endsWith(".json")) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") return item;
          if (item.text) return item.text;
          if (item.prompt && item.response) return `Prompt: ${item.prompt}\nResponse: ${item.response}`;
          if (item.question && item.answer) return `Question: ${item.question}\nAnswer: ${item.answer}`;
          return JSON.stringify(item);
        });
      }
      return [JSON.stringify(parsed)];
    } catch (err) {
      console.warn(`Error parsing JSON ${filePath}, attempting line parse:`, err.message);
    }
  }

  // Parse JSONL
  const lines = content.split("\n");
  const extracted = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      if (obj.text) extracted.push(obj.text);
      else if (obj.prompt && obj.response) extracted.push(`Prompt: ${obj.prompt}\nResponse: ${obj.response}`);
      else if (obj.question && obj.answer) extracted.push(`Question: ${obj.question}\nAnswer: ${obj.answer}`);
      else if (obj.response) extracted.push(obj.response);
      else extracted.push(JSON.stringify(obj));
    } catch {
      extracted.push(trimmed);
    }
  }

  return extracted;
}

// Retain backward compatibility alias for existing code
export function loadJSONL(filePath) {
  const entries = loadDatasetFile(filePath);
  return entries.join("\n");
}

export function chunkText(text, size = 300, overlap = 50) {
  if (!text) return [];
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
    if (i >= text.length) break;
  }

  return chunks;
}
