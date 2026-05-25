require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const examRoutes = require("./routes/examRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const paperRoutes = require("./routes/paperRoutes");
const questionRoutes = require("./routes/questionRoutes");
const uploadRoutes = require("./routes/upload");
const generateFileRoutes = require("./routes/generateFromFile");

const app = express();

let cachedConnectionPromise = null;

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([
    "http://localhost:3000",
    "http://localhost:5173",
    "https://examgenrator.vercel.app",
    ...configuredOrigins,
  ]);
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined");
    }

    cachedConnectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => mongoose.connection)
      .catch((error) => {
        cachedConnectionPromise = null;
        throw error;
      });
  }

  return cachedConnectionPromise;
}

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} -> ${req.url}`);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = getAllowedOrigins();
      const isVercelPreview =
        typeof origin === "string" &&
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

      if (!origin || allowedOrigins.has(origin) || isVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/exams", examRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/exams/generate-from-file", generateFileRoutes);

app.get("/", (req, res) => {
  res.send("ExamGen Backend Running Successfully");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

module.exports = { app, connectDB };
