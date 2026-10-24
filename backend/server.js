
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// API status
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

// Authentication API
app.use("/api/auth", authRoutes);

// Articles API
app.use("/api/articles", articleRoutes);

// Cloudinary image uploads API
app.use("/api/upload", uploadRoutes);

// Contact form API
app.use("/api/contact", contactRoutes);

// Handle invalid JSON requests
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  next(error);
});

// Unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`BestXWorst server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start BestXWorst server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
