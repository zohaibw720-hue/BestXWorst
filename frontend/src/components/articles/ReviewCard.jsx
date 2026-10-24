
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getArticleType(article) {
  return normalizeText(article.articleType || "review");
}

export default function ReviewCard({ article, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  const dateLabel =
    publishedDate && !Number.isNaN(publishedDate.getTime())
      ? publishedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "LATEST STORY";

  const articleUrl = article.slug
    ? `/article/${article.slug}`
    : "/";

  const articleType = getArticleType(article);

  const readLabel =
    articleType === "best"
      ? "READ THE STORY"
      : articleType === "worst"
        ? "READ THE VERDICT"
        : articleType === "versus"
          ? "SEE THE COMPARISON"
          : "READ THE STORY";

  return (
    <article className="review-card">
      <Link
        className="review-image-wrap"
        to={articleUrl}
        aria-label={`Read ${article.title}`}
      >
        {article.featuredImage && !imageFailed ? (
          <img
            className="review-image"
            src={article.featuredImage}
            alt={article.title || "Article cover"}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className={`review-image-placeholder placeholder-${index % 3}`}
          >
            <span>BXW.</span>
          </div>
        )}

        <span className="card-category">
          {article.category || "Reviews"}
        </span>

        <span className="card-arrow">
          <ArrowUpRight size={18} />
        </span>
      </Link>

      <div className="review-card-content">
        <div className="review-meta">
          <span>{dateLabel}</span>
          <span className="meta-dot">·</span>
          <span>{article.author || "Editorial Team"}</span>
        </div>

        <h3>
          <Link to={articleUrl}>
            {article.title || "Untitled article"}
          </Link>
        </h3>

        <p className="review-excerpt">
          {article.excerpt ||
            "Explore the details in our latest editorial story."}
        </p>

        <Link
          className="card-read-link"
          to={articleUrl}
          aria-label={`${readLabel}: ${article.title || "article"}`}
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
