export const validateAudioUpload = (req, res, next) => {
  if (!req.files || !req.files.audio) {
    return res.status(400).json({ error: "No audio file provided in request." });
  }

  const audioFile = req.files.audio;

  // Maximum file size: 15MB
  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  if (audioFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "Audio file exceeds maximum allowed limit of 15MB." });
  }

  // Allowed audio MIME types
  const allowedMimeTypes = [
    "audio/webm",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
    "video/webm",
  ];

  if (audioFile.mimetype && !allowedMimeTypes.includes(audioFile.mimetype)) {
    return res.status(400).json({
      error: `Unsupported audio format: ${audioFile.mimetype}. Allowed formats: webm, wav, mp3, ogg, m4a.`,
    });
  }

  next();
};
