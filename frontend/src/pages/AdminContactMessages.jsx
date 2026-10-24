
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ExternalLink,
  LogOut,
  RefreshCw,
  Mail,
  MailOpen,
  CheckCircle2,
  Clock3,
  ArrowLeft,
  Send,
} from "lucide-react";
import "../styles/AdminContactMessages.css";

const API_BASE = "http://localhost:5000/api";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

export default function AdminContactMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  // Load messages from the backend.
  // State updates happen after the asynchronous request.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchMessages() {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/contact/admin/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!active) return;

        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return;
        }

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Unable to load contact messages."
          );
        }

        const list = Array.isArray(result.data) ? result.data : [];

        setMessages(list);
        setSelectedMessage((current) => {
          if (!current) return null;

          return (
            list.find((message) => message._id === current._id) || null
          );
        });
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

    void fetchMessages();

    return () => {
      active = false;
      controller.abort();
    };
  }, [handleLogout, navigate, refreshKey]);

  const handleRefresh = () => {
    setError("");
    setLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const updateStatus = async (messageId, status) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      handleLogout();
      return;
    }

    try {
      setUpdatingId(messageId);
      setError("");

      const response = await fetch(
        `${API_BASE}/contact/${messageId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to update message status."
        );
      }

      const updatedMessage = result.data;

      setMessages((current) =>
        current.map((message) =>
          message._id === messageId
            ? { ...message, ...updatedMessage }
            : message
        )
      );

      setSelectedMessage((current) =>
        current?._id === messageId
          ? { ...current, ...updatedMessage }
          : current
      );
    } catch (err) {
      setError(err.message || "Could not update the message.");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = messages.filter((message) =>
    filter === "all" ? true : message.status === filter
  );

  const newCount = messages.filter(
    (message) => (message.status || "new") === "new"
  ).length;

  const readCount = messages.filter(
    (message) => message.status === "read"
  ).length;

  const repliedCount = messages.filter(
    (message) => message.status === "replied"
  ).length;

  return (
    <div className="admin-messages">
      <aside className="admin-messages__sidebar">
        <a href="/" className="admin-messages__brand">
          BEST<span>X</span>WORST
        </a>

        <p className="admin-messages__sidebar-label">WORKSPACE</p>

        <nav className="admin-messages__nav">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/articles")}
          >
            <FileText size={18} />
            All Articles
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/articles/new")}
          >
            <Plus size={18} />
            New Article
          </button>

          <button
            type="button"
            className="admin-messages__nav-active"
            onClick={() => navigate("/admin/messages")}
          >
            <Mail size={18} />
            Contact Messages

            {newCount > 0 && (
              <span className="admin-messages__nav-count">
                {newCount}
              </span>
            )}
          </button>
        </nav>

        <div className="admin-messages__sidebar-bottom">
          <a href="/" className="admin-messages__website-link">
            <ExternalLink size={18} />
            View Website
          </a>

          <button type="button" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-messages__main">
        <header className="admin-messages__topbar">
          <div>
            <p className="admin-messages__eyebrow">
              ADMINISTRATION
            </p>

            <h1>Contact Messages</h1>

            <p className="admin-messages__subtitle">
              Read and manage messages sent through your website.
            </p>
          </div>

          <button
            className="admin-messages__refresh"
            type="button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <section className="admin-messages__stats">
          <article>
            <span className="admin-messages__stat-icon">
              <Mail size={20} />
            </span>
            <p>Total messages</p>
            <strong>{loading ? "—" : messages.length}</strong>
          </article>

          <article>
            <span className="admin-messages__stat-icon admin-messages__stat-icon--gold">
              <Clock3 size={20} />
            </span>
            <p>New</p>
            <strong>{loading ? "—" : newCount}</strong>
          </article>

          <article>
            <span className="admin-messages__stat-icon admin-messages__stat-icon--blue">
              <MailOpen size={20} />
            </span>
            <p>Read</p>
            <strong>{loading ? "—" : readCount}</strong>
          </article>

          <article>
            <span className="admin-messages__stat-icon admin-messages__stat-icon--green">
              <CheckCircle2 size={20} />
            </span>
            <p>Replied</p>
            <strong>{loading ? "—" : repliedCount}</strong>
          </article>
        </section>

        {error && (
          <div className="admin-messages__error" role="alert">
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

        <section className="admin-messages__workspace">
          <div className="admin-messages__list-panel">
            <div className="admin-messages__list-heading">
              <div>
                <p className="admin-messages__eyebrow">INBOX</p>
                <h2>Received messages</h2>
              </div>

              <select
                aria-label="Filter messages by status"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">All messages</option>

                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="admin-messages__empty">
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="admin-messages__empty">
                <Mail size={30} />
                <h3>No messages found</h3>
                <p>
                  {filter === "all"
                    ? "Messages submitted through your contact form will appear here."
                    : `There are no messages marked "${filter}".`}
                </p>
              </div>
            ) : (
              <div className="admin-messages__list">
                {filteredMessages.map((message) => (
                  <button
                    type="button"
                    key={message._id}
                    className={`admin-messages__message-item ${
                      selectedMessage?._id === message._id
                        ? "admin-messages__message-item--active"
                        : ""
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <span className="admin-messages__message-item-top">
                      <strong>{message.name}</strong>

                      <span
                        className={`admin-messages__status admin-messages__status--${message.status || "new"}`}
                      >
                        {message.status || "new"}
                      </span>
                    </span>

                    <span className="admin-messages__message-subject">
                      {message.subject}
                    </span>

                    <span className="admin-messages__message-preview">
                      {message.message}
                    </span>

                    <span className="admin-messages__message-date">
                      {formatDate(message.createdAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="admin-messages__detail-panel">
            {selectedMessage ? (
              <>
                <button
                  type="button"
                  className="admin-messages__back"
                  onClick={() => setSelectedMessage(null)}
                >
                  <ArrowLeft size={15} />
                  Clear selection
                </button>

                <div className="admin-messages__detail-heading">
                  <p className="admin-messages__eyebrow">
                    MESSAGE DETAILS
                  </p>

                  <h2>{selectedMessage.subject}</h2>

                  <span
                    className={`admin-messages__status admin-messages__status--${selectedMessage.status || "new"}`}
                  >
                    {selectedMessage.status || "new"}
                  </span>
                </div>

                <div className="admin-messages__sender">
                  <div className="admin-messages__avatar">
                    {(selectedMessage.name || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{selectedMessage.name}</strong>

                    <a href={`mailto:${selectedMessage.email}`}>
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <p className="admin-messages__received">
                  Received {formatDate(selectedMessage.createdAt)}
                </p>

                <div className="admin-messages__body">
                  {selectedMessage.message}
                </div>

                <a
                  className="admin-messages__reply"
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject || "Your message"}`
                  )}`}
                >
                  <Send size={16} />
                  Reply by email
                </a>

                <div className="admin-messages__status-controls">
                  <label htmlFor="message-status">
                    Update message status
                  </label>

                  <select
                    id="message-status"
                    value={selectedMessage.status || "new"}
                    onChange={(event) =>
                      updateStatus(
                        selectedMessage._id,
                        event.target.value
                      )
                    }
                    disabled={updatingId === selectedMessage._id}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {updatingId === selectedMessage._id && (
                    <span className="admin-messages__updating">
                      Saving status...
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="admin-messages__detail-empty">
                <MailOpen size={34} />
                <h3>Select a message</h3>
                <p>
                  Choose a message from your inbox to read its details.
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="admin-messages__footer">
          BESTXWORST <span>·</span> Independent editorial management
        </footer>
      </main>
    </div>
  );
}
