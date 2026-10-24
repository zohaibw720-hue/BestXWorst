
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard.jsx";
import LoadingState from "../common/LoadingState.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import EmptyState from "../common/EmptyState.jsx";

const categories = [
  "All",
  "Cars",
  "Technology",
  "AI & Software",
  "Home & Living",
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Travel",
];

const categoryAliases = {
  "AI & Software": [
    "ai",
    "software",
    "artificial intelligence",
    "apps",
    "productivity",
  ],
  Cars: [
    "car",
    "cars",
    "automotive",
    "mobility",
    "electric vehicle",
    "ev",
    "luxury cars",
    "sports cars",
  ],
  "Home & Living": [
    "home",
    "living",
    "appliance",
    "smart home",
    "kitchen",
  ],
  Lifestyle: [
    "lifestyle",
    "fitness",
    "outdoor equipment",
    "everyday carry",
  ],
  Technology: [
    "technology",
    "tech",
    "phone",
    "laptop",
    "computer",
    "audio",
  ],
  Beauty: [
    "beauty",
    "skincare",
    "skin care",
    "makeup",
    "cosmetics",
  ],
  Fashion: [
    "fashion",
    "clothing",
    "apparel",
    "style",
    "accessories",
  ],
  Travel: [
    "travel",
    "travel gear",
    "luggage",
    "suitcases",
    "backpacks",
  ],
};

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getArticleType(article) {
  return normalizeText(article.articleType || "review");
}

function articleMatchesCategory(article, selectedCategory) {
  if (selectedCategory === "All") return true;

  const articleCategory = normalizeText(article.category);
  const aliases = categoryAliases[selectedCategory] || [
    normalizeText(selectedCategory),
  ];

  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);

    return (
      articleCategory === normalizedAlias ||
      articleCategory.includes(normalizedAlias)
    );
  });
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

function LatestArticles({
  articles = [],
  loading,
  error,
  onRetry,
  search,
  category,
  setCategory,
  setSearch,
}) {
  const reviewArticles = articles.filter((article) =>
    ["review", ""].includes(getArticleType(article))
  );

  const query = normalizeText(search);

  const filteredArticles = reviewArticles.filter((article) => {
    const matchesCategory = articleMatchesCategory(
      article,
      category
    );

    const searchableText = [
      article.title,
      article.excerpt,
      article.category,
      article.author,
      article.articleType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      matchesCategory &&
      (!query || searchableText.includes(query))
    );
  });

  function resetFilters() {
    setCategory("All");
    setSearch("");
  }

  return (
    <section className="latest-section" id="latest">
      <SectionHeading
        eyebrow="THE AUTOMOTIVE & EDITORIAL DESK"
        title="Worth a closer look."
        description="Independent reviews, considered comparisons, and stories about the details that matter."
      />

      <div className="category-toolbar">
        <div
          className="category-filters"
          aria-label="Filter articles by category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`category-filter ${
                category === item ? "category-filter-active" : ""
              }`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <span className="article-count">
          {loading
            ? "LOADING..."
            : `${filteredArticles.length} ARTICLES`}
        </span>
      </div>

      {loading && (
        <LoadingState message="Fetching the latest stories..." />
      )}

      {!loading && error && (
        <ErrorMessage
          title="We couldn't load the reviews."
          message={error}
          onRetry={onRetry}
        />
      )}

      {!loading && !error && filteredArticles.length > 0 && (
        <div className="review-grid">
          {filteredArticles.slice(0, 6).map((article, index) => (
            <ReviewCard
              key={article._id || article.slug || article.title}
              article={article}
              index={index}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredArticles.length === 0 && (
        <EmptyState
          title={
            search
              ? "No matching reviews."
              : category === "All"
                ? "The next review starts here."
                : `No ${category} reviews yet.`
          }
          message={
            search
              ? "Try a different search term or choose another category."
              : "Published articles from your backend will appear here."
          }
          actionLabel={
            search || category !== "All"
              ? "VIEW ALL REVIEWS"
              : undefined
          }
          onAction={resetFilters}
        />
      )}

      {!loading && !error && filteredArticles.length > 0 && (
        <div className="latest-footer">
          <span>
            INDEPENDENT THINKING STARTS WITH BETTER QUESTIONS.
          </span>

          <Link className="collection-view-link" to="/reviews/">
            VIEW ALL REVIEWS
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}

export default LatestArticles;
