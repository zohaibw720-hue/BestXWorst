import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Send,
  RefreshCw,
  FileText,
} from "lucide-react";
import "../styles/ArticlesList.css";

const API_URL = "http://localhost:5000/api/articles";

function ArticlesList() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      try {
        setError("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/admin/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Articles load nahi ho sake."
          );
        }

        const articleList = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.articles)
              ? data.articles
              : [];

        setArticles(articleList);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Server se connection nahi ho saka. Backend check karein."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      controller.abort();
    };
  }, [navigate, refreshCount]);

  async function handleDelete(article) {
    const confirmed = window.confirm(
      `Kya aap "${article.title}" ko permanently delete karna chahte hain? Yeh action undo nahi ho sakta.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(article._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await fetch(`${API_URL}/${article._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Article delete nahi ho saka."
        );
      }

      setArticles((currentArticles) =>
        currentArticles.filter(
          (item) => item._id !== article._id
        )
      );
    } catch (err) {
      setError(
        err.message || "Article delete karte waqt error aaya."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTogglePublish(article) {
    const isPublished = article.status === "published";
    const nextStatus = isPublished ? "draft" : "published";

    const confirmed = window.confirm(
      isPublished
        ? `Kya aap "${article.title}" ko unpublish karna chahte hain? Yeh public website se hat jayega.`
        : `Kya aap "${article.title}" ko publish karna chahte hain? Yeh public website par available ho jayega.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(article._id);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await fetch(`${API_URL}/${article._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Article status update nahi ho saka."
        );
      }

      if (!data.data) {
        throw new Error(
          "Updated article response mein nahi mila. Refresh karke dobara check karein."
        );
      }

      setArticles((currentArticles) =>
        currentArticles.map((item) =>
          item._id === article._id ? data.data : item
        )
      );
    } catch (err) {
      setError(
        err.message || "Article status update karte waqt error aaya."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleRefresh() {
    setLoading(true);
    setRefreshCount((count) => count + 1);
  }

  function getStatusClass(status) {
    return status === "published" ? "published" : "draft";
  }

  if (loading) {
    return (
      <main className="articles-page">
        <div className="articles-state">
          <span className="articles-spinner" />
          <p>Articles load ho rahe hain...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="articles-page">
      <div className="articles-container">
        <header className="articles-header">
          <div>
            <p className="articles-eyebrow">CONTENT MANAGEMENT</p>
            <h1>Articles</h1>
            <p className="articles-subtitle">
              Apni website ke articles manage karein.
            </p>
          </div>

          <div className="articles-header-actions">
            <button
              type="button"
              className="articles-secondary-button"
              onClick={handleRefresh}
              disabled={Boolean(updatingId) || Boolean(deletingId)}
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              to="/admin/articles/new"
              className="articles-primary-button"
            >
              <Plus size={18} />
              New Article
            </Link>
          </div>
        </header>

        {error && (
          <div className="articles-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={handleRefresh}>
              Try again
            </button>
          </div>
        )}

        <section className="articles-summary">
          <div className="articles-summary-icon">
            <FileText size={23} />
          </div>

          <div>
            <p>Total articles</p>
            <h2>{articles.length}</h2>
          </div>
        </section>

        <section className="articles-table-card">
          <div className="articles-table-heading">
            <div>
              <h2>All Articles</h2>
              <p>Draft aur published articles ki list.</p>
            </div>

            <span className="articles-count">
              {articles.length} total
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="articles-empty">
              <FileText size={38} />

              <h3>
                {error
                  ? "Articles load nahi ho sake"
                  : "Abhi koi article nahi hai"}
              </h3>

              <p>
                {error
                  ? "Connection check karein aur dobara try karein."
                  : "Apna pehla article create karne ke liye neeche click karein."}
              </p>

              {!error && (
                <Link
                  to="/admin/articles/new"
                  className="articles-primary-button"
                >
                  <Plus size={18} />
                  Create Article
                </Link>
              )}

              {error && (
                <button
                  type="button"
                  className="articles-secondary-button"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={17} />
                  Try again
                </button>
              )}
            </div>
          ) : (
            <div className="articles-table-wrapper">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => {
                    const isPublished =
                      article.status === "published";

                    const isUpdating =
                      updatingId === article._id;

                    const isDeleting =
                      deletingId === article._id;

                    const isBusy =
                      Boolean(updatingId) ||
                      Boolean(deletingId);

                    return (
                      <tr key={article._id}>
                        <td>
                          <div className="article-title-cell">
                            {article.featuredImage ? (
                              <img
                                className="article-thumbnail"
                                src={article.featuredImage}
                                alt=""
                                loading="lazy"
                              />
                            ) : (
                              <div className="article-thumbnail article-thumbnail-placeholder">
                                <FileText size={20} />
                              </div>
                            )}

                            <div className="article-title-info">
                              <strong>{article.title}</strong>
                              <span>
                                {article.slug || "No slug"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="article-category">
                            {article.category || "Uncategorized"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`article-status ${getStatusClass(
                              article.status
                            )}`}
                          >
                            {article.status || "draft"}
                          </span>
                        </td>

                        <td>
                          {article.updatedAt
                            ? new Date(
                                article.updatedAt
                              ).toLocaleDateString()
                            : article.createdAt
                              ? new Date(
                                  article.createdAt
                                ).toLocaleDateString()
                              : "—"}
                        </td>

                        <td>
                          <div className="article-action-buttons">
                            {isPublished && article.slug && (
                              <Link
                                to={`/article/${article.slug}`}
                                className="article-icon-button"
                                aria-label={`View ${article.title}`}
                                title="View article"
                              >
                                <Eye size={17} />
                              </Link>
                            )}

                            <Link
                              to={`/admin/articles/edit/${article._id}`}
                              className="article-icon-button"
                              aria-label={`Edit ${article.title}`}
                              title="Edit article"
                            >
                              <Pencil size={17} />
                            </Link>

                            <button
                              type="button"
                              className="article-icon-button"
                              onClick={() =>
                                handleTogglePublish(article)
                              }
                              disabled={isBusy}
                              aria-label={
                                isPublished
                                  ? `Unpublish ${article.title}`
                                  : `Publish ${article.title}`
                              }
                              title={
                                isUpdating
                                  ? "Updating status..."
                                  : isPublished
                                    ? "Unpublish article"
                                    : "Publish article"
                              }
                            >
                              {isUpdating ? (
                                <RefreshCw size={17} />
                              ) : isPublished ? (
                                <EyeOff size={17} />
                              ) : (
                                <Send size={17} />
                              )}
                            </button>

                            <button
                              type="button"
                              className="article-icon-button article-delete-button"
                              onClick={() => handleDelete(article)}
                              disabled={isBusy}
                              aria-label={`Delete ${article.title}`}
                              title={
                                isDeleting
                                  ? "Deleting article..."
                                  : "Delete article"
                              }
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="articles-back-link">
          <Link to="/admin/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ArticlesList;