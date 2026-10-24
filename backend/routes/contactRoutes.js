
const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} = require("../controllers/contactController");

const { protectAdmin } = require("../middleware/authMiddleware");

// Admin only: Get all contact messages
router.get("/admin/all", protectAdmin, getContactMessages);

// Admin only: Update message status
router.patch("/:id/status", protectAdmin, updateContactMessageStatus);

// Public: Submit a contact form message
router.post("/", createContactMessage);

module.exports = router;
