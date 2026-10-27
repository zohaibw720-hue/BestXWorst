import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/home/Footer.jsx";
import ReviewCard from "../components/articles/ReviewCard.jsx";
import "./CategoryPage.css";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://bestxworst-backend.vercel.app/api"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/articles`;
const ARTICLES_PER_PAGE = 10;

/* =========================================================
   CATEGORY CONTENT
========================================================= */

const categoryConfig = {
  reviews: {
    label: "THE REVIEW LIBRARY",
    title: "Reviews that tell you more.",
    description:
      "Explore independent reviews that examine performance, build quality, practical use, value and the trade-offs between products.",
    intro: "INDEPENDENT PRODUCT REVIEWS",
    bio: "A closer look at what matters before you make a decision.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=85",
    type: "reviews",
  },
  best: {
    label: "THE SHORTLIST",
    title: "Find your best pick.",
    description:
      "Explore standout products and recommendations to help you decide what fits your needs and budget.",
    intro: "BETTER PICKS. CLEARER REASONS",
    bio: "Recommendations should explain why a choice stands out.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85",
    type: "articleType",
    articleType: "best",
  },
  versus: {
    label: "HEAD TO HEAD",
    title: "Compare before you choose.",
    description:
      "Understand the differences between competing products, their features, limitations and value.",
    intro: "THE DETAILS THAT DIFFER",
    bio: "Side-by-side comparisons that put the differences into context.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=85",
    type: "articleType",
    articleType: "versus",
  },
  worst: {
    label: "KNOW THE TRADE-OFFS",
    title: "Know what to avoid.",
    description:
      "Understand disappointing performance, limitations and costly compromises before deciding.",
    intro: "LOOK BEYOND THE PROMISE",
    bio: "Drawbacks deserve as much attention as the selling points.",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=2200&q=85",
    type: "articleType",
    articleType: "worst",
  },
  technology: {
    label: "TECHNOLOGY",
    title: "Technology, considered.",
    description:
      "Explore reviews and comparisons of phones, computers, audio equipment, cameras and everyday technology.",
    intro: "DEVICES. PERFORMANCE. VALUE.",
    bio: "A practical look at what today's technology actually delivers.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "technology",
      "tech",
      "phones",
      "phone",
      "laptops",
      "laptop",
      "computers",
      "computer",
      "audio",
    ],
  },
  "ai-software": {
    label: "AI & SOFTWARE",
    title: "Tools worth understanding.",
    description:
      "Explore AI tools, software, productivity apps and digital services, including their capabilities and limitations.",
    intro: "SMARTER SOFTWARE DECISIONS",
    bio: "Understand the tools you use and where they fall short.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "ai & software",
      "ai",
      "software",
      "artificial intelligence",
      "apps",
      "productivity",
    ],
  },
  home: {
    label: "HOME & LIVING",
    title: "Make your home work better.",
    description:
      "Explore appliances, smart-home devices, cleaning tools and practical technology for everyday living.",
    intro: "PRACTICAL PICKS FOR EVERYDAY LIFE",
    bio: "A closer look at essentials that make everyday living easier.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "home & living",
      "home",
      "living",
      "appliances",
      "appliance",
      "smart home",
      "kitchen",
    ],
  },
  cars: {
    label: "CARS & MOBILITY",
    title: "A clearer view of the road.",
    description:
      "Explore automotive technology, car accessories, electric mobility and practical comparisons for drivers.",
    intro: "AUTOMOTIVE PRODUCTS & TECHNOLOGY",
    bio: "Explore the products and innovations shaping the driving experience.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "cars",
      "car",
      "cars & mobility",
      "automotive",
      "mobility",
      "electric vehicle",
      "ev",
    ],
  },
  lifestyle: {
    label: "LIFESTYLE",
    title: "Everyday products, considered.",
    description:
      "Explore practical reviews of travel gear, personal electronics, outdoor equipment and everyday essentials.",
    intro: "PRACTICAL CHOICES FOR EVERYDAY LIFE",
    bio: "Considered products for routines, interests and journeys.",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "lifestyle",
      "fitness",
      "outdoor equipment",
      "everyday carry",
    ],
  },
  beauty: {
    label: "BEAUTY",
    title: "Beauty, considered.",
    description:
      "Explore beauty products and practical guides covering product details and important trade-offs.",
    intro: "BEAUTY PRODUCTS & GUIDES",
    bio: "Clear information to support informed beauty choices.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "beauty",
      "skincare",
      "skin care",
      "makeup",
      "cosmetics",
    ],
  },
  fashion: {
    label: "FASHION",
    title: "Style with a clearer perspective.",
    description:
      "Explore fashion products, accessories and practical guides to everyday style, quality and value.",
    intro: "FASHION & PERSONAL STYLE",
    bio: "A practical perspective on personal style and accessories.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "fashion",
      "clothing",
      "apparel",
      "style",
      "accessories",
    ],
  },
  travel: {
    label: "TRAVEL",
    title: "Make every journey count.",
    description:
      "Explore travel essentials, useful gear and practical advice for your next journey.",
    intro: "TRAVEL GEAR & PRACTICAL ADVICE",
    bio: "Considered essentials and useful guidance for journeys near and far.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "travel",
      "travel gear",
      "luggage",
      "suitcases",
      "backpacks",
    ],
  },
  "how-to": {
    label: "PRACTICAL ADVICE",
    title: "Understand how to get it right.",
    description:
      "Find practical guides to choosing, setting up, maintaining and troubleshooting products.",
    intro: "USEFUL GUIDES. CLEAR ANSWERS",
    bio: "Straightforward guidance for informed decisions and practical problems.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2200&q=85",
    type: "category",
    aliases: [
      "how-to",
      "how to",
      "guide",
      "tutorial",
      "troubleshooting",
    ],
  },
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getCategoryIndex(slug) {
  const index = Object.keys(categoryConfig).indexOf(slug);
  return String(index + 1).padStart(3, "0");
}

function getArticleText(article) {
  return [
    article.title,
    article.excerpt,
    article.category,
    article.author,
    article.articleType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function articleMatchesPage(article, config) {
  const articleType = normalizeText(article.articleType);

  if (config.type === "reviews") {
    return articleType === "review" || !articleType;
  }

  if (config.type === "articleType") {
    return articleType === config.articleType;
  }

  if (config.type === "category") {
    const category = normalizeText(article.category);

    if (config.aliases.includes("how-to")) {
      const text = normalizeText(
        `${article.title || ""} ${article.excerpt || ""}`
      );

      return /\bhow[- ]to\b|\bguide\b|\btutorial\b|\btroubleshooting\b|\btroubleshoot\b/.test(
        text
      );
    }

    return config.aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);

      return (
        category === normalizedAlias ||
        category.includes(normalizedAlias)
      );
    });
  }

  return false;
}

/* =========================================================
   CATEGORY PAGE
========================================================= */

function CategoryPage() {
  const { categorySlug } = useParams();
  const config = categoryConfig[categorySlug];

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedCategory, setLoadedCategory] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [pagination, setPagination] = useState({
    page: 1,
    categorySlug: "",
    search: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Articles API request failed with status ${response.status}.`
          );
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Unexpected response from the articles API.");
        }

        setArticles(result.data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") return;

        console.error("Category articles request failed:", fetchError);

        setError(
          "We couldn't load the articles. Check your backend connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadedCategory(categorySlug);
          setLoading(false);
        }
      }
    }

    void loadArticles();

    return () => controller.abort();
  }, [categorySlug, retryCount]);

  const isLoading = loading || loadedCategory !== categorySlug;

  const visibleArticles = useMemo(() => {
    if (!config) return [];

    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesPage = articleMatchesPage(article, config);
      const matchesSearch =
        !query || getArticleText(article).includes(query);

      return matchesPage && matchesSearch;
    });
  }, [articles, config, search]);

  /* PAGINATION */

  const totalPages = Math.ceil(
    visibleArticles.length / ARTICLES_PER_PAGE
  );

  const samePaginationContext =
    pagination.categorySlug === categorySlug &&
    pagination.search === search;

  const requestedPage = samePaginationContext ? pagination.page : 1;

  const currentPage = Math.min(
    Math.max(requestedPage, 1),
    Math.max(totalPages, 1)
  );

  const paginatedArticles = visibleArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  function goToPage(page) {
    const safePage = Math.min(
      Math.max(page, 1),
      Math.max(totalPages, 1)
    );

    setPagination({
      page: safePage,
      categorySlug,
      search,
    });
  }

  if (!config) {
    return (
      <>
        <Header search={search} setSearch={setSearch} />

        <main className="category-not-found">
          <span className="category-eyebrow">BESTXWORST</span>
          <h1>Page not found.</h1>
          <p>This category doesn't exist or may have moved.</p>

          <Link className="category-home-link" to="/">
            BACK TO HOMEPAGE <ArrowRight size={16} />
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <main className="category-page">
        <section
          className={`category-hero category-hero-${categorySlug}`}
          style={{
            "--category-hero-image": `url("${config.image}")`,
          }}
          aria-labelledby="category-hero-title"
        >
          <div className="category-hero-overlay" aria-hidden="true" />

          <nav className="category-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">HOME</Link>

            <span
              className="category-breadcrumb-separator"
              aria-hidden="true"
            >
              /
            </span>

            <span aria-current="page">{config.label}</span>
          </nav>

          <div className="category-hero-content">
            <div className="category-hero-side-label">
              <span className="category-red-dot" aria-hidden="true" />
              <span>{config.intro}</span>

              <span className="category-hero-index">
                BXW / {getCategoryIndex(categorySlug)}
              </span>
            </div>

            <div className="category-hero-copy">
              <span className="category-eyebrow">
                <span className="category-red-dot" aria-hidden="true" />
                {config.label}
              </span>

              <h1 id="category-hero-title">{config.title}</h1>

              <p className="category-hero-bio">{config.bio}</p>

              <p className="category-hero-description">
                {config.description}
              </p>

              <a className="category-hero-cta" href="#category-results">
                EXPLORE STORIES
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="category-hero-bottom">
            <span>INDEPENDENTLY MINDED. ALWAYS INFORMED.</span>
            <span>NO PAID RANKINGS.</span>
          </div>
        </section>

        <section
          className="category-results"
          id="category-results"
          aria-labelledby="category-results-title"
        >
          <div className="category-results-heading">
            <div>
              <span className="category-eyebrow">THE JOURNAL</span>

              <h2 id="category-results-title">
                {config.type === "reviews"
                  ? "Latest reviews."
                  : "Explore the stories."}
              </h2>
            </div>

            <span className="category-result-count">
              {isLoading
                ? "LOADING..."
                : `${visibleArticles.length} ARTICLES`}
            </span>
          </div>

          {isLoading && (
            <div className="category-status" role="status" aria-live="polite">
              <span className="category-spinner" />
              <p>Loading published articles...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="category-status" role="alert">
              <h3>Articles are temporarily unavailable.</h3>
              <p>{error}</p>

              <button
                className="category-retry"
                type="button"
                onClick={() => {
                  setError("");
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
              >
                TRY AGAIN <ArrowRight size={15} />
              </button>
            </div>
          )}

          {!isLoading && !error && paginatedArticles.length > 0 && (
            <div className="category-article-grid">
              {paginatedArticles.map((article, index) => (
                <div
                  className="category-article-item"
                  key={
                    article._id ||
                    article.slug ||
                    article.title ||
                    index
                  }
                >
                  <ReviewCard article={article} index={index} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && totalPages > 1 && (
            <nav className="category-pagination" aria-label="Article pages">
              <button
                type="button"
                className="category-pagination-previous"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowRight
                  size={15}
                  className="category-pagination-back-icon"
                  aria-hidden="true"
                />
                Previous
              </button>

              <div className="category-pagination-numbers">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "category-page-number active"
                        : "category-page-number"
                    }
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="category-pagination-next"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ArrowRight size={15} aria-hidden="true" />
              </button>
            </nav>
          )}

          {!isLoading && !error && visibleArticles.length > 0 && (
            <p className="category-pagination-summary" aria-live="polite">
              Showing {(currentPage - 1) * ARTICLES_PER_PAGE + 1}
              {"–"}
              {Math.min(
                currentPage * ARTICLES_PER_PAGE,
                visibleArticles.length
              )}{" "}
              of {visibleArticles.length} articles
            </p>
          )}

          {!isLoading && !error && visibleArticles.length === 0 && (
            <div className="category-status category-empty">
              <span className="category-empty-mark">BXW.</span>

              <h3>
                {search.trim()
                  ? "No matching articles."
                  : "More independent coverage is on the way."}
              </h3>

              <p>
                {search.trim()
                  ? "Try a different search term to find relevant articles."
                  : "Published articles will appear here when available. We won't invent reviews or rankings just to fill the page."}
              </p>

              {search.trim() && (
                <button
                  className="category-retry"
                  type="button"
                  onClick={() => setSearch("")}
                >
                  CLEAR SEARCH <X size={15} />
                </button>
              )}
            </div>
          )}
        </section>

        <section
          className="category-promise"
          aria-labelledby="category-promise-title"
        >
          <span className="category-eyebrow">THE BESTXWORST PROMISE</span>

          <h2 id="category-promise-title">Evidence before opinion.</h2>

          <p>
            We aim to explain what works, what doesn't and who a product
            is right for. Our reviews should inform your decision, not
            make it for you.
          </p>

          <Link to="/#method">
            OUR APPROACH <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default CategoryPage;