
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard.jsx";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getArticleType(article) {
  return normalizeText(article.articleType || "review");
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow section-eyebrow">
          <span className="red-dot" />
          {eyebrow}
        </div>

        <h2>{title}</h2>
      </div>

      {description && <p>{description}</p>}
    </div>
  );
}

export default function ArticleTypeSection({
  articles,
  type,
  eyebrow,
  title,
  description,
  link,
  linkLabel,
}) {
  const allSectionArticles = articles.filter(
    (article) => getArticleType(article) === type
  );

  const sectionArticles = allSectionArticles.slice(0, 3);

  return (
    <section
      className={`article-type-section article-type-${type}`}
      id={`${type}-articles`}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {sectionArticles.length > 0 ? (
        <div className="review-grid">
          {sectionArticles.map((article, index) => (
            <ReviewCard
              key={article._id || article.slug || article.title}
              article={article}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="collection-empty">
          <span className="empty-mark">BXW.</span>
          <p>No published stories in this section yet.</p>
        </div>
      )}

      <div className="collection-footer">
        <span>
          {sectionArticles.length > 0
            ? `SHOWING ${sectionArticles.length} OF ${allSectionArticles.length} STORIES`
            : "NEW STORIES COMING SOON"}
        </span>

        <Link className="collection-view-link" to={link}>
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
