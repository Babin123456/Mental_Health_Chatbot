import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import voiceRoute from "./routes/voiceRoute.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api", voiceRoute);

// Default route
app.get("/", (req, res) => {
  res.send("MindFul Backend is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
