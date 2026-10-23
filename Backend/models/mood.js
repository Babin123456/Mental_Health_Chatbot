import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    moodLabel: {
      type: String,
      required: true,
      enum: ["Great", "Good", "Neutral", "Low", "Overwhelmed"],
    },
    emotions: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
    loggedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Mood", moodSchema);
