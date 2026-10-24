const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters."],
    },

    subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
      enum: [
        "General enquiry",
        "Correction or factual error",
        "Editorial standards",
        "Business enquiry",
        "Technical issue",
        "Other",
      ],
      default: "General enquiry",
    },

    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters."],
    },

    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);