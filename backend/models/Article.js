
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      required: [true, "Article slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      required: [true, "Article excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },

    content: {
      type: String,
      required: [true, "Article content is required"],
    },

    category: {
      type: String,
      required: [true, "Article category is required"],
      trim: true,
    },

    articleType: {
      type: String,
      enum: ["review", "best", "worst", "versus"],
      default: "review",
      lowercase: true,
      trim: true,
    },

    featuredImage: {
      type: String,
      default: "",
      trim: true,
    },

    author: {
      type: String,
      default: "BestXWorst Editorial Team",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
