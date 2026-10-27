
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageTheme } from "../../utils/imageTheme.js";

function getDateLabel(value) {
  if (!value) return "LATEST STORY";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "LATEST STORY";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getArticleType(article) {
  return String(article.articleType || "review")
    .trim()
    .toLowerCase();
}

function getReadLabel(articleType) {
  switch (articleType) {
    case "best":
      return "READ REVIEW";
    case "worst":
      return "READ THE VERDICT";
    case "versus":
      return "SEE THE COMPARISON";
    default:
      return "READ THE STORY";
  }
}

export default function ReviewCard({ article, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageTheme, setImageTheme] = useState(null);

  const title = article.title?.trim() || "Untitled article";
  const category = article.category?.trim() || "Reviews";
  const author = article.author?.trim() || "Editorial Team";

  const excerpt =
    article.excerpt?.trim() ||
    "Explore the details in our latest editorial story.";

  const dateLabel = getDateLabel(article.publishedAt);
  const articleType = getArticleType(article);
  const isBestPick = articleType === "best";
  const readLabel = getReadLabel(articleType);

  const articleUrl = article.slug
    ? `/article/${encodeURIComponent(article.slug)}`
    : "/";

  const imageUrl =
    typeof article.featuredImage === "string"
      ? article.featuredImage.trim()
      : "";

  function handleImageLoad(event) {
    const detectedTheme = getImageTheme(event.currentTarget);
    setImageTheme(detectedTheme);
  }

  function handleImageError() {
    setImageFailed(true);
    setImageTheme(null);
  }

  return (
    <article
      className={[
        "review-card",
        isBestPick ? "review-card-best-pick" : "",
        imageTheme ? "has-image-theme" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={imageTheme || undefined}
      data-article-type={articleType}
    >
      <Link
        className="review-image-wrap"
        to={articleUrl}
        aria-label={`Read ${title}`}
      >
        {imageUrl && !imageFailed ? (
          <img
            className="review-image"
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div
            className={`review-image-placeholder placeholder-${
              Math.abs(Number(index) || 0) % 3
            }`}
            aria-label="Article image unavailable"
            role="img"
          >
            <span>BXW.</span>
          </div>
        )}

        <span className="card-category">{category}</span>

        <span className="card-arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </Link>

      <div className="review-card-content">
        <div className="review-meta">
          <span>{dateLabel}</span>
          <span className="meta-dot" aria-hidden="true">
            ·
          </span>
          <span>{author}</span>
        </div>

        <h3>
          <Link to={articleUrl}>{title}</Link>
        </h3>

        <p className="review-excerpt">{excerpt}</p>

        <Link
          className="card-read-link"
          to={articleUrl}
          aria-label={`${readLabel}: ${title}`}
        >
          <span>{readLabel}</span>

          <span className="card-read-icon">
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </article>
  );
}
