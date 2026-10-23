export const sanitizeInput = (text) => {
  if (typeof text !== "string") return "";

  // Normalize Unicode representation and strip dangerous control characters
  let clean = text.normalize("NFKC").replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

  // Sanitize potential prompt injection keywords
  clean = clean.replace(/ignore\s+(previous|all)\s+instructions/gi, "[filtered]");
  clean = clean.replace(/system\s+prompt/gi, "[filtered]");

  return clean.trim();
};
