
const Article = require("../models/Article");

// @desc    Get all published articles for the public website
// @route   GET /api/articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      status: "published",
    }).sort({ publishedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Get articles error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published articles",
    });
  }
};

// @desc    Get all articles for the authenticated admin
// @route   GET /api/articles/admin/all
const getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("Get admin articles error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin articles",
    });
  }
};

// @desc    Get a published article by ID
// @route   GET /api/articles/:id
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Published article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    const isInvalidId = error.name === "CastError";

    if (!isInvalidId) {
      console.error("Get article by ID error:", error.message);
    }

    return res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: isInvalidId
        ? "Invalid article ID"
        : "Failed to fetch article",
    });
  }
};

// @desc    Get a published article by slug
// @route   GET /api/articles/slug/:slug
const getArticleBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const article = await Article.findOne({
      slug,
      status: "published",
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Published article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Get article by slug error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch article",
    });
  }
};

// @desc    Create a new article
// @route   POST /api/articles
const createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      articleType,
      featuredImage,
      author,
      status,
    } = req.body;

    const articleStatus = status || "draft";

    const article = await Article.create({
      title,
      slug,
      excerpt,
      content,
      category,
      articleType: articleType || "review",
      featuredImage,
      author,
      status: articleStatus,
      publishedAt:
        articleStatus === "published" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An article with this slug already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create article error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create article",
    });
  }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const updates = { ...req.body };

    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.publishedAt;

    const existingArticle = await Article.findById(req.params.id);

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    if (updates.status === "published") {
      if (existingArticle.status !== "published") {
        updates.publishedAt = new Date();
      } else {
        updates.publishedAt =
          existingArticle.publishedAt || new Date();
      }
    } else if (updates.status === "draft") {
      updates.publishedAt = null;
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    const isInvalidId = error.name === "CastError";
    const isDuplicateSlug = error.code === 11000;
    const isValidationError = error.name === "ValidationError";

    if (!isInvalidId && !isDuplicateSlug && !isValidationError) {
      console.error("Update article error:", error.message);
    }

    const statusCode = isDuplicateSlug
      ? 409
      : isInvalidId || isValidationError
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: isDuplicateSlug
        ? "An article with this slug already exists"
        : isInvalidId
          ? "Invalid article ID"
          : isValidationError
            ? error.message
            : "Failed to update article",
    });
  }
};

// @desc    Delete an article
// @route   DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    const isInvalidId = error.name === "CastError";

    if (!isInvalidId) {
      console.error("Delete article error:", error.message);
    }

    return res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: isInvalidId
        ? "Invalid article ID"
        : "Failed to delete article",
    });
  }
};

module.exports = {
  getArticles,
  getAdminArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
