import ChatHistory from "../models/chatHistory.js";
import Session from "../models/session.js";

export const getOrCreateSession = async (sessionId, userId = null, initialMessage = "") => {
  if (sessionId) {
    try {
      const existing = await Session.findById(sessionId);
      if (existing) return existing;
    } catch {
      // invalid object id fallback to create new
    }
  }

  let title = "New Conversation";
  if (initialMessage && initialMessage.trim().length > 0) {
    const cleanMsg = initialMessage.trim();
    title = cleanMsg.length > 30 ? cleanMsg.slice(0, 30) + "..." : cleanMsg;
  }

  const newSession = new Session({
    userId: userId || null,
    title,
    messageCount: 0,
    lastMessageAt: new Date(),
  });

  return await newSession.save();
};

export const saveMessage = async ({ sessionId, userId, sender, text, intent = "general_support", metadata = {} }) => {
  const message = new ChatHistory({
    sessionId,
    userId: userId || null,
    sender,
    text,
    intent,
    metadata,
  });

  await message.save();

  await Session.findByIdAndUpdate(sessionId, {
    $inc: { messageCount: 1 },
    $set: { lastMessageAt: new Date() },
  });

  return message;
};

export const fetchSessionMessages = async (sessionId, limit = 50) => {
  return await ChatHistory.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
};

export const fetchUserSessions = async (userId, limit = 20) => {
  const query = userId ? { userId, isActive: true } : { isActive: true };
  return await Session.find(query)
    .sort({ lastMessageAt: -1 })
    .limit(limit)
    .lean();
};

export const removeSession = async (sessionId, userId = null) => {
  const query = { _id: sessionId };
  if (userId) query.userId = userId;

  const session = await Session.findOne(query);
  if (!session) return false;

  await Session.findByIdAndUpdate(sessionId, { isActive: false });
  await ChatHistory.deleteMany({ sessionId });
  return true;
};
