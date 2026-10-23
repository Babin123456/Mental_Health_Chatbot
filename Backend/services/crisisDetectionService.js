import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let helplinesCache = null;

const loadHelplines = () => {
  if (helplinesCache) return helplinesCache;
  try {
    const filePath = path.join(__dirname, "../data/helplines.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    helplinesCache = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load helplines.json:", err.message);
    helplinesCache = { regional: [], international: [] };
  }
  return helplinesCache;
};

// High-confidence patterns for suicidal ideation, severe crisis, and self-harm
const CRISIS_PATTERNS = [
  /\b(kill|end|hang|shoot|poison|cut)\s+(my\s*self|me|it\s*all)\b/i,
  /\b(suicid(e|al)|want\s+to\s+die|wish\s+i\s+were\s+dead|better\s+off\s+dead)\b/i,
  /\b(tired\s+of\s+living|no\s+reason\s+to\s+live|don'?t\s+want\s+to\s+(exist|live|wake\s*up))\b/i,
  /\b(self[-\s]?harm|hurting\s+myself|cutting\s+my\s*wrist)\b/i,
  /\b(mar\s*jaana\s*chahta\s*hoon|jaan\s*dena\s*hai|zindagi\s*khatam)\b/i,
];

export const detectCrisis = (text) => {
  if (!text || typeof text !== "string") {
    return { isCrisis: false, helplines: [] };
  }

  const normalized = text.toLowerCase();
  const matched = CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));

  if (!matched) {
    return { isCrisis: false, helplines: [] };
  }

  const data = loadHelplines();
  const combined = (data.regional || []).concat(data.international || []);

  return {
    isCrisis: true,
    severity: "critical",
    matched: true,
    helplines: combined,
    interventionMessage:
      "I hear how much pain you are in right now, and I want you to know that you are not alone. Your life matters deeply, and compassionate help is available immediately. Please reach out to one of these free, confidential support services right away:",
  };
};
