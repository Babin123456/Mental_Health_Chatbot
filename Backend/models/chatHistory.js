import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sender: {
      type: String,
      enum: ["user", "bot", "system"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    intent: {
      type: String,
      default: "general_support",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChatHistory", messageSchema);
