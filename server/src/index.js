import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import axios from "axios";

dotenv.config();

export const app = express();

// Pre-flight requests
app.options("*", cors());

// CORS middleware with more detailed configuration
app.use(
  cors({
    origin: true, // This will reflect the request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    exposedHeaders: ["set-cookie"],
  })
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.json({ message: "This is a CORS-enabled response" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

axios.defaults.withCredentials = true;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!", error: err.message });
});

// Catch-all route
app.use("*", (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
