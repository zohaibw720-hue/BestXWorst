
const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const sharp = require("sharp");

const cloudinary = require("../config/cloudinary");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
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
        new Error("Only JPG, PNG, and WEBP images are allowed.")
      );
    }

    callback(null, true);
  },
});

// BestXWorst Midnight Tech palette
const NAVY = { r: 11, g: 18, b: 32 };
const SLATE = { r: 17, g: 28, b: 46 };
const CYAN = { r: 34, g: 211, b: 238 };
const COOL_WHITE = { r: 241, g: 245, b: 249 };

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixColor(a, b, amount) {
  const t = Math.max(0, Math.min(1, amount));

  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function gradePixel(r, g, b) {
  // Perceived brightness of the original pixel.
  const luminance =
    0.2126 * r +
    0.7152 * g +
    0.0722 * b;

  const light = luminance / 255;

  // Preserve some original colour and detail.
  const original = { r, g, b };

  // Create a theme-colour gradient based on brightness.
  let themeColor;

  if (light < 0.38) {
    const t = light / 0.38;
    themeColor = mixColor(NAVY, SLATE, t);
  } else if (light < 0.78) {
    const t = (light - 0.38) / 0.40;
    themeColor = mixColor(SLATE, COOL_WHITE, t * 0.55);
  } else {
    const t = (light - 0.78) / 0.22;
    themeColor = mixColor(
      mixColor(SLATE, COOL_WHITE, 0.55),
      COOL_WHITE,
      t
    );
  }

  // Retain luminance detail while reducing original colour dominance.
  const detail = 0.70 + light * 0.48;

  const graded = {
    r: themeColor.r * detail,
    g: themeColor.g * detail,
    b: themeColor.b * detail,
  };

  // Blend a controlled amount of original colour into the result.
  const result = mixColor(graded, original, 0.22);

  // Add a restrained cyan accent to the darker midtones.
  const cyanStrength =
    Math.max(0, 1 - Math.abs(light - 0.48) / 0.48) * 0.13;

  const accented = mixColor(result, CYAN, cyanStrength);

  return [
    clamp(accented.r),
    clamp(accented.g),
    clamp(accented.b),
  ];
}

async function processImage(buffer) {
  const input = sharp(buffer, {
    limitInputPixels: 40000000,
  });

  const metadata = await input.metadata();

  if (!["jpeg", "png", "webp"].includes(metadata.format)) {
    throw new Error("Unsupported image format.");
  }

  // Normalize orientation, limit image dimensions, and use RGB pixels.
  // Transparent areas receive the site's midnight navy background.
  const { data, info } = await input
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .flatten({ background: "#0B1220" })
    .toColourspace("srgb")
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 3) {
    throw new Error("Image could not be converted to RGB.");
  }

  // Transform every pixel using the Midnight Tech colour grade.
  for (let i = 0; i < data.length; i += 3) {
    const [r, g, b] = gradePixel(
      data[i],
      data[i + 1],
      data[i + 2]
    );

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  // Export a consistent, web-friendly article image.
  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 3,
    },
  })
    .jpeg({
      quality: 90,
      mozjpeg: true,
    })
    .toBuffer();
}

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

      // Process the image before uploading it to Cloudinary.
      const processedBuffer = await processImage(req.file.buffer);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "bestxworst/articles",
            resource_type: "image",
            format: "jpg",
          },
          (error, uploadedImage) => {
            if (error) {
              return reject(error);
            }

            resolve(uploadedImage);
          }
        );

        Readable.from(processedBuffer).pipe(uploadStream);
      });

      return res.status(201).json({
        success: true,
        message: "Image colour-graded and uploaded successfully.",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error(
        "Image processing/upload error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Image processing failed. Please try another image.",
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
