import axios from "axios";
import fs from "fs";

export const transcribeAudioFile = async (filePath) => {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error("ASSEMBLYAI_API_KEY is not configured on the server.");
  }

  // 1) Upload audio file stream to AssemblyAI
  const fileStream = fs.createReadStream(filePath);
  const uploadResponse = await axios({
    method: "post",
    url: "https://api.assemblyai.com/v2/upload",
    headers: {
      authorization: apiKey,
      "transfer-encoding": "chunked",
    },
    data: fileStream,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });

  const audioUrl = uploadResponse.data?.upload_url;
  if (!audioUrl) {
    throw new Error("Failed to upload audio to AssemblyAI.");
  }

  // 2) Request transcription
  const transcriptResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: audioUrl,
      language_detection: true,
    },
    {
      headers: { authorization: apiKey },
    }
  );

  const transcriptId = transcriptResponse.data?.id;
  if (!transcriptId) {
    throw new Error("Failed to initialize transcription job.");
  }

  // 3) Poll result with timeout (maximum 60 seconds)
  const startTime = Date.now();
  const TIMEOUT_MS = 60000;

  while (Date.now() - startTime < TIMEOUT_MS) {
    const polling = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: { authorization: apiKey },
      }
    );

    if (polling.data.status === "completed") {
      return polling.data.text || "";
    }

    if (polling.data.status === "error") {
      throw new Error(polling.data.error || "Transcription processing failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("Transcription request timed out.");
};
