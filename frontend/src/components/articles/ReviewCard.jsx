
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function getDateLabel(value) {
  if (!value) {
    return "LATEST STORY";
  }

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
      return "READ THE STORY";
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

  const title = article.title?.trim() || "Untitled article";
  const category = article.category?.trim() || "Reviews";
  const author = article.author?.trim() || "Editorial Team";

  const excerpt =
    article.excerpt?.trim() ||
    "Explore the details in our latest editorial story.";

  const dateLabel = getDateLabel(article.publishedAt);

  const articleUrl = article.slug
    ? `/article/${encodeURIComponent(article.slug)}`
    : "/";

  const articleType = getArticleType(article);
  const readLabel = getReadLabel(articleType);

  const imageUrl =
    typeof article.featuredImage === "string"
      ? article.featuredImage.trim()
      : "";

  return (
    <article className="review-card">
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
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`review-image-placeholder placeholder-${Math.abs(
              Number(index) || 0
            ) % 3}`}
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
