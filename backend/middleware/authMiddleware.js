
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id || decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const admin = await Admin.findById(decoded.id).select(
      "_id name email role"
    );

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or access denied",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    console.error("Admin authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to authenticate admin",
    });
  }
};

module.exports = {
  protectAdmin,
};
