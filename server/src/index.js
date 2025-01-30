import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import { createServer } from "http";

dotenv.config();

const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("*", (req, res) => {
  res.status(200).json({
    message: "Connected to vercel app",
  });
});

// Create an HTTP server to wrap the Express app
const server = createServer(app);

// Export the server as a serverless function
export default (req, res) => {
  server.emit("request", req, res);
};
