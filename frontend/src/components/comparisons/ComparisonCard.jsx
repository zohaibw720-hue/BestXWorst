
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ComparisonCard.css";

function ComparisonCard({ article, index = 0 }) {
  if (!article) return null;

  const articleUrl = article.slug
    ? `/article/${article.slug}`
    : null;

  return (
    <article
      className="comparison-card"
      style={{ "--comparison-index": index }}
    >
      {article.featuredImage ? (
        <Link
          to={articleUrl || "#"}
          className="comparison-card-image"
          aria-label={`Read ${article.title || "comparison article"}`}
        >
          <img
            src={article.featuredImage}
            alt={article.title || "Comparison article"}
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="comparison-card-content">
        <span className="comparison-card-label">
          BEST VS WORST
        </span>

        <h3>{article.title || "Untitled comparison"}</h3>

        {article.excerpt && <p>{article.excerpt}</p>}

        {articleUrl && (
          <Link
            className="comparison-card-link"
            to={articleUrl}
          >
            READ COMPARISON
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}

export default ComparisonCard;
