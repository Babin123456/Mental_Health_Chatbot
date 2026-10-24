import { ragQuery } from "../services/ragService.js";
import {
  getOrCreateSession,
  saveMessage,
  fetchSessionMessages,
  fetchUserSessions,
  removeSession,
} from "../services/chatHistoryService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?.userId || null;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Retrieve or establish persistent session
    let currentSession = null;
    try {
      currentSession = await getOrCreateSession(sessionId, userId, message);
    } catch (sessionErr) {
      console.warn("Session retrieval fallback:", sessionErr.message);
    }

    // Persist user prompt if database session is active
    if (currentSession) {
      try {
        await saveMessage({
          sessionId: currentSession._id,
          userId,
          sender: "user",
          text: message.trim(),
        });
      } catch (err) {
        console.warn("Could not persist user message:", err.message);
      }
    }

    // Generate AI empathetic response
    const reply = await ragQuery(message);

    // Persist assistant reply
    if (currentSession) {
      try {
        await saveMessage({
          sessionId: currentSession._id,
          userId,
          sender: "bot",
          text: reply,
        });
      } catch (err) {
        console.warn("Could not persist bot message:", err.message);
      }
    }

    return res.status(200).json({
      reply,
      sessionId: currentSession ? currentSession._id : null,
      sessionTitle: currentSession ? currentSession.title : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ error: "Failed to process chat message" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const sessions = await fetchUserSessions(userId);
    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return res.status(500).json({ error: "Failed to retrieve sessions" });
  }
};

export const getSessionHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const messages = await fetchSessionMessages(sessionId);
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Fetch history error:", error);
    return res.status(500).json({ error: "Failed to retrieve conversation history" });
  }
};

export const createSession = async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const { title } = req.body;
    const session = await getOrCreateSession(null, userId, title || "New Conversation");
    return res.status(201).json({ session });
  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({ error: "Failed to create new session" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.userId || null;

    const success = await removeSession(sessionId, userId);
    if (!success) {
      return res.status(404).json({ error: "Session not found or unauthorized" });
    }

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    return res.status(500).json({ error: "Failed to delete session" });
  }
};
