
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  X,
} from "lucide-react";

import Header from "../components/layout/Header.jsx";
import "./CategoryPage.css";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://bestxworst-backend.vercel.app/api"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/articles`;

/* =========================================================
   CATEGORY CONTENT
   ========================================================= */

const categoryConfig = {
  reviews: {
    label: "THE REVIEW LIBRARY",
    title: "Reviews that tell you more.",
    description:
      "Explore independent reviews that examine performance, build quality, practical use, value and the trade-offs behind each product.",
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
      "Explore standout products and recommendations, with clear reasons to help you decide what fits your needs and budget.",
    intro: "BETTER PICKS. CLEARER REASONS.",
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
      "Understand the meaningful differences between competing products, their features, their limitations and their value.",
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
      "Understand disappointing performance, significant limitations and costly compromises before deciding what is right for you.",
    intro: "LOOK BEYOND THE PROMISE",
    bio: "The drawbacks and limitations deserve as much attention as the selling points.",
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
      "Explore AI tools, software, productivity apps and digital services, including their capabilities, limitations and value.",
    intro: "SMARTER SOFTWARE DECISIONS",
    bio: "Understand the tools you use, what they can do and where they fall short.",
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
    bio: "A closer look at the essentials that make everyday living easier.",
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
    bio: "Explore the products, technology and innovations shaping the driving experience.",
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
      "Explore practical reviews and comparisons of travel gear, personal electronics, outdoor equipment and everyday essentials.",
    intro: "PRACTICAL CHOICES FOR EVERYDAY LIFE",
    bio: "Considered products for the routines, interests and journeys that shape everyday life.",
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
      "Explore beauty products and practical guides that explain intended use, product details and important trade-offs.",
    intro: "BEAUTY PRODUCTS & GUIDES",
    bio: "Explore beauty essentials with clear information to support informed choices.",
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
    bio: "A practical perspective on personal style, wardrobe essentials and accessories.",
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
      "Explore travel essentials, useful gear and practical advice to help you prepare for your next journey.",
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
      "Find practical guides to choosing, setting up, maintaining and troubleshooting the products you use.",
    intro: "USEFUL GUIDES. CLEAR ANSWERS.",
    bio: "Straightforward guidance to help you make informed decisions and solve practical problems.",
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
   ARTICLE FILTERING HELPERS
   ========================================================= */

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
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
      const articleText = normalizeText(
        `${article.title || ""} ${article.excerpt || ""}`
      );

      const guidePattern =
        /\bhow[- ]to\b|\bguide\b|\btutorial\b|\btroubleshooting\b|\btroubleshoot\b/;

      return guidePattern.test(articleText);
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
   CATEGORY FOOTER
   ========================================================= */

function CategoryFooter() {
  const footerGroups = [
    {
      title: "EXPLORE",
      links: [
        { label: "Latest reviews", to: "/reviews/" },
        { label: "Best picks", to: "/best/" },
        { label: "Versus comparisons", to: "/versus/" },
        { label: "Worst picks", to: "/worst/" },
      ],
    },
    {
      title: "CATEGORIES",
      links: [
        { label: "Technology", to: "/technology/" },
        { label: "AI & Software", to: "/ai-software/" },
        { label: "Home & Living", to: "/home/" },
        { label: "Cars & Mobility", to: "/cars/" },
        { label: "Lifestyle", to: "/lifestyle/" },
        { label: "Beauty", to: "/beauty/" },
        { label: "Fashion", to: "/fashion/" },
        { label: "Travel", to: "/travel/" },
        { label: "How-To Guides", to: "/how-to/" },
      ],
    },
    {
      title: "OUR STANDARDS",
      links: [
        { label: "Our approach", to: "/#method" },
        { label: "Editorial standards", to: "/editorial-standards/" },
        { label: "How we test", to: "/how-we-test/" },
        { label: "Contact", to: "/contact/" },
      ],
    },
  ];

  return (
    <footer className="site-footer category-site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" to="/">
            BEST<span className="wordmark-x">X</span>WORST
            <span className="wordmark-period">.</span>
          </Link>

          <p className="footer-tagline">
            Know the best.
            <br />
            Avoid the worst.
          </p>

          <p className="footer-description">
            Independent consumer reviews and comparisons.
          </p>
        </div>

        <div className="footer-links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <span className="footer-heading">
                {group.title}
              </span>

              {group.links.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} BESTXWORST. ALL RIGHTS RESERVED.
        </span>

        <span>INDEPENDENTLY MINDED. ALWAYS INFORMED.</span>

        <Link to="/">BACK TO HOME ↑</Link>
      </div>

      <div className="footer-big-wordmark">
        <Link to="/" aria-label="BestXWorst homepage">
          BEST<span className="wordmark-x">X</span>WORST
          <span className="wordmark-period">.</span>
        </Link>
      </div>
    </footer>
  );
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

  /* Fetch articles from the backend */

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
          throw new Error(
            "Unexpected response from the articles API."
          );
        }

        setArticles(result.data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        console.error(
          "Category articles request failed:",
          fetchError
        );

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

  const isLoading =
    loading || loadedCategory !== categorySlug;

  /* Filter articles by category and search term */

  const visibleArticles = useMemo(() => {
    if (!config) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesPage = articleMatchesPage(article, config);

      const matchesSearch =
        !query || getArticleText(article).includes(query);

      return matchesPage && matchesSearch;
    });
  }, [articles, config, search]);

  /* Unknown category */

  if (!config) {
    return (
      <>
        <Header search={search} setSearch={setSearch} />

        <main className="category-not-found">
          <span className="category-eyebrow">
            BESTXWORST
          </span>

          <h1>Category not found.</h1>

          <p>
            This category doesn't exist or may have moved.
          </p>

          <Link className="category-home-link" to="/">
            BACK TO HOMEPAGE <ArrowRight size={16} />
          </Link>
        </main>

        <CategoryFooter />
      </>
    );
  }

  return (
    <>
      <Header search={search} setSearch={setSearch} />

      <main className="category-page">
        {/* Category hero */}

        <section
          className={`category-hero category-hero-${categorySlug}`}
          style={{
            "--category-hero-image": `url("${config.image}")`,
          }}
        >
          <div className="category-hero-overlay" />

          <nav
            className="category-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">HOME</Link>

            <span
              className="category-breadcrumb-separator"
              aria-hidden="true"
            >
              /
            </span>

            <span>{config.label}</span>
          </nav>

          <div className="category-hero-content">
            <div className="category-hero-side-label">
              <span
                className="category-red-dot"
                aria-hidden="true"
              />

              <span>{config.intro}</span>

              <span className="category-hero-index">
                BXW / 001
              </span>
            </div>

            <div className="category-hero-copy">
              <span className="category-eyebrow">
                <span
                  className="category-red-dot"
                  aria-hidden="true"
                />

                {config.label}
              </span>

              <h1>{config.title}</h1>

              <p className="category-hero-bio">
                {config.bio}
              </p>

              <p className="category-hero-description">
                {config.description}
              </p>

              <a
                className="category-hero-cta"
                href="#category-results"
              >
                EXPLORE STORIES
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="category-hero-bottom">
            <span>
              INDEPENDENTLY MINDED. ALWAYS INFORMED.
            </span>

            <span>NO PAID RANKINGS.</span>
          </div>
        </section>

        {/* Article results */}

        <section
          className="category-results"
          id="category-results"
        >
          <div className="category-results-heading">
            <div>
              <span className="category-eyebrow">
                THE JOURNAL
              </span>

              <h2>
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

          {/* Loading state */}

          {isLoading && (
            <div
              className="category-status"
              role="status"
              aria-live="polite"
            >
              <span className="category-spinner" />

              <p>Loading published articles...</p>
            </div>
          )}

          {/* Error state */}

          {!isLoading && error && (
            <div
              className="category-status"
              role="alert"
            >
              <h3>Articles are temporarily unavailable.</h3>

              <p>{error}</p>

              <button
                className="category-retry"
                type="button"
                onClick={() => {
                  setError("");
                  setRetryCount((count) => count + 1);
                }}
              >
                TRY AGAIN <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* Article cards */}

          {!isLoading &&
            !error &&
            visibleArticles.length > 0 && (
              <div className="category-article-grid">
                {visibleArticles.map((article, index) => {
                  const articleUrl = article.slug
                    ? `/article/${article.slug}`
                    : null;

                  const articleTitle =
                    article.title || "Untitled article";

                  return (
                    <article
                      className="category-article-card"
                      key={
                        article._id ||
                        article.slug ||
                        article.title ||
                        index
                      }
                    >
                      {articleUrl ? (
                        <Link
                          className={`category-article-image image-variant-${index % 3}`}
                          to={articleUrl}
                          aria-label={`Read ${articleTitle}`}
                        >
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt={articleTitle}
                              loading="lazy"
                            />
                          ) : (
                            <span className="category-image-mark">
                              BXW.
                            </span>
                          )}

                          <span className="category-card-arrow">
                            <ArrowUpRight size={18} />
                          </span>
                        </Link>
                      ) : (
                        <div
                          className={`category-article-image image-variant-${index % 3}`}
                        >
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt={articleTitle}
                              loading="lazy"
                            />
                          ) : (
                            <span className="category-image-mark">
                              BXW.
                            </span>
                          )}
                        </div>
                      )}

                      <div className="category-article-meta">
                        <span>
                          {article.category || "Review"}
                        </span>

                        <span aria-hidden="true">·</span>

                        <span>
                          {article.author || "Editorial Team"}
                        </span>
                      </div>

                      <h3>
                        {articleUrl ? (
                          <Link to={articleUrl}>
                            {articleTitle}
                          </Link>
                        ) : (
                          articleTitle
                        )}
                      </h3>

                      <p>
                        {article.excerpt ||
                          "Explore the details, performance and trade-offs in the full article."}
                      </p>

                      {articleUrl && (
                        <Link
                          className="category-read-link"
                          to={articleUrl}
                          aria-label={`Read article: ${articleTitle}`}
                        >
                          <span>READ ARTICLE</span>

                          <ArrowRight
                            className="category-read-arrow"
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

          {/* Empty state */}

          {!isLoading &&
            !error &&
            visibleArticles.length === 0 && (
              <div className="category-status category-empty">
                <span className="category-empty-mark">
                  BXW.
                </span>

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

        {/* Editorial promise */}

        <section className="category-promise">
          <span className="category-eyebrow">
            THE BESTXWORST PROMISE
          </span>

          <h2>Evidence before opinion.</h2>

          <p>
            We aim to explain what works, what doesn't and
            who a product is right for. Our reviews should
            inform your decision, not make it for you.
          </p>

          <Link to="/#method">
            OUR APPROACH <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <CategoryFooter />
    </>
  );
}

export default CategoryPage;
