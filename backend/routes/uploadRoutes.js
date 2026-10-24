
const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");

const cloudinary = require("../config/cloudinary");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, WEBP, and GIF images are allowed.")
      );
    }

    callback(null, true);
  },
});

router.post(
  "/image",
  protectAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "bestxworst/articles",
            resource_type: "image",
          },
          (error, uploadedImage) => {
            if (error) return reject(error);
            resolve(uploadedImage);
          }
        );

        Readable.from(req.file.buffer).pipe(uploadStream);
      });

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Image upload error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }
  }
);

// Handle invalid file types and oversized uploads.
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : "The image upload was rejected.";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid image upload.",
    });
  }

  next();
});

module.exports = router;
