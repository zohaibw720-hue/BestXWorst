
const express = require("express");
const router = express.Router();

const {
  getArticles,
  getAdminArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const { protectAdmin } = require("../middleware/authMiddleware");

// Public: Get all published articles
router.get("/", getArticles);

// Admin only: Get all articles, including drafts
// Keep this route before "/:id".
router.get("/admin/all", protectAdmin, getAdminArticles);

// Admin only: Create a new article
router.post("/", protectAdmin, createArticle);

// Public: Get a published article by slug
router.get("/slug/:slug", getArticleBySlug);

// Public: Get a published article by ID
// Admin only: Update or delete an article by ID
router.route("/:id")
  .get(getArticleById)
  .put(protectAdmin, updateArticle)
  .delete(protectAdmin, deleteArticle);

module.exports = router;
