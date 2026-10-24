
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to BestXWorst API!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BestXWorst backend is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`BestXWorst server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start BestXWorst server:", error.message);
      process.exitCode = 1;
    });
}

// Vercel serverless entry point
module.exports = app;
