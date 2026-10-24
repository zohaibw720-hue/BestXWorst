const ContactMessage = require("../models/ContactMessage");

// Public: Submit a contact form message
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all contact form fields.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: {
        id: contactMessage._id,
      },
    });
  } catch (error) {
    console.error("Create contact message error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
    });
  }
};

// Admin only: Get all contact messages
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get contact messages error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load contact messages.",
    });
  }
};

// Admin only: Update a message's status
const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["new", "read", "replied"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be new, read, or replied.",
      });
    }

    const contactMessage = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message status updated.",
      data: contactMessage,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    console.error("Update contact message error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update the message status.",
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
};
