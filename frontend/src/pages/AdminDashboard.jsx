
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ExternalLink,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Clock3,
  Newspaper,
  Mail,
} from "lucide-react";
import "../styles/AdminDashboard.css";

const API_URL = "http://localhost:5000/api/articles/admin/all";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadArticles() {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Unable to load articles."
          );
        }

        if (!active) return;

        const articleList = Array.isArray(result.data)
          ? result.data
          : [];

        setArticles(articleList);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError" && active) {
          setError(
            err.message || "Could not connect to the backend server."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadArticles();

    return () => {
      active = false;
      controller.abort();
    };
  }, [navigate, refreshKey]);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  };

  const publishedArticles = articles.filter(
    (article) => article.status === "published"
  ).length;

  const draftArticles = articles.filter(
    (article) => article.status === "draft"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <a href="/" className="admin-dashboard__brand">
          BEST<span>X</span>WORST
        </a>

        <p className="admin-sidebar__label">WORKSPACE</p>

        <nav className="admin-sidebar__nav">
          <button
            className="admin-sidebar__link admin-sidebar__link--active"
            type="button"
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className="admin-sidebar__link"
            type="button"
            onClick={() => navigate("/admin/articles")}
          >
            <FileText size={18} />
            All Articles
          </button>

          <button
            className="admin-sidebar__link"
            type="button"
            onClick={() => navigate("/admin/articles/new")}
          >
            <Plus size={18} />
            New Article
          </button>

          <button
            className="admin-sidebar__link"
            type="button"
            onClick={() => navigate("/admin/messages")}
          >
            <Mail size={18} />
            Contact Messages
          </button>
        </nav>

        <div className="admin-sidebar__bottom">
          <a href="/" className="admin-sidebar__link">
            <ExternalLink size={18} />
            View Website
          </a>

          <button
            className="admin-sidebar__link"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-dashboard__main">
        <header className="admin-dashboard__topbar">
          <div>
            <p className="admin-dashboard__eyebrow">
              ADMINISTRATION
            </p>
            <h1>Dashboard</h1>
          </div>

          <button
            className="admin-dashboard__refresh"
            type="button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <section className="admin-dashboard__welcome">
          <div>
            <p>YOUR EDITORIAL WORKSPACE</p>
            <h2>Good to see you back.</h2>
            <span>
              Manage your content and keep your publication up to date.
            </span>
          </div>

          <Newspaper size={54} strokeWidth={1.2} />
        </section>

        <section className="admin-dashboard__stats">
          <article className="admin-stat">
            <div className="admin-stat__icon admin-stat__icon--dark">
              <FileText size={21} />
            </div>
            <p>Total articles</p>
            <strong>{loading ? "—" : articles.length}</strong>
            <span>Articles returned by the API</span>
          </article>

          <article className="admin-stat">
            <div className="admin-stat__icon admin-stat__icon--green">
              <CheckCircle2 size={21} />
            </div>
            <p>Published</p>
            <strong>{loading ? "—" : publishedArticles}</strong>
            <span>Currently marked published</span>
          </article>

          <article className="admin-stat">
            <div className="admin-stat__icon admin-stat__icon--gold">
              <Clock3 size={21} />
            </div>
            <p>Drafts</p>
            <strong>{loading ? "—" : draftArticles}</strong>
            <span>Currently marked draft</span>
          </article>
        </section>

        <section className="admin-dashboard__articles">
          <div className="admin-dashboard__section-heading">
            <div>
              <p className="admin-dashboard__eyebrow">
                CONTENT MANAGEMENT
              </p>
              <h2>Recent articles</h2>
            </div>

            <button
              className="admin-dashboard__text-button"
              type="button"
              onClick={() => navigate("/admin/articles")}
            >
              View all <span>→</span>
            </button>
          </div>

          {error && (
            <div className="admin-dashboard__message" role="alert">
              <p>{error}</p>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="admin-dashboard__empty">
              Loading articles...
            </div>
          ) : !error && articles.length === 0 ? (
            <div className="admin-dashboard__empty">
              <FileText size={30} />
              <h3>No articles found</h3>
              <p>
                Articles will appear here when the API returns them.
              </p>
            </div>
          ) : !error ? (
            <div className="admin-dashboard__table-wrap">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>ARTICLE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {articles.slice(0, 5).map((article, index) => (
                    <tr
                      key={
                        article._id ||
                        article.slug ||
                        `${article.title || "article"}-${index}`
                      }
                    >
                      <td>
                        <strong>
                          {article.title || "Untitled article"}
                        </strong>
                        <span>
                          {article.category || "Uncategorised"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status admin-status--${
                            article.status === "published"
                              ? "published"
                              : "draft"
                          }`}
                        >
                          {article.status || "unknown"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          article.publishedAt ||
                            article.updatedAt ||
                            article.createdAt
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <footer className="admin-dashboard__footer">
          BESTXWORST <span>·</span> Independent editorial management
        </footer>
      </main>
    </div>
  );
}
