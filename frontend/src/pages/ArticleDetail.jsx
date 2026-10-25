
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
} from "lucide-react";

import { api } from "../services/api";
import "./ArticleDetail.css";

/* =========================================================
   INLINE MARKDOWN
   ========================================================= */

function renderInlineMarkdown(text = "") {
  const parts = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  );

  return parts.map((part, index) => {
    if (
      part.startsWith("**") &&
      part.endsWith("**") &&
      part.length > 4
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      part.length > 2
    ) {
      return (
        <em key={index}>
          {part.slice(1, -1)}
        </em>
      );
    }

    if (
      part.startsWith("`") &&
      part.endsWith("`") &&
      part.length > 2
    ) {
      return (
        <code key={index}>
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

/* =========================================================
   MARKDOWN CONTENT RENDERER
   ========================================================= */

function renderMarkdown(content = "") {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n");

  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let listType = null;

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ").trim();

      if (text) {
        blocks.push({
          type: "paragraph",
          text,
        });
      }

      paragraphLines = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({
        type: listType,
        items: [...listItems],
      });

      listItems = [];
      listType = null;
    }
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    const unorderedMatch = line.match(/^[-*+]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (headingMatch) {
      flushParagraph();
      flushList();

      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });

      return;
    }

    if (unorderedMatch || orderedMatch) {
      flushParagraph();

      const currentType = unorderedMatch
        ? "unordered"
        : "ordered";

      if (listType && listType !== currentType) {
        flushList();
      }

      listType = currentType;

      listItems.push(
        unorderedMatch
          ? unorderedMatch[1]
          : orderedMatch[1]
      );

      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const text = renderInlineMarkdown(block.text);

      if (block.level <= 2) {
        return <h2 key={index}>{text}</h2>;
      }

      if (block.level === 3) {
        return <h3 key={index}>{text}</h3>;
      }

      return <h4 key={index}>{text}</h4>;
    }

    if (block.type === "unordered") {
      return (
        <ul key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === "ordered") {
      return (
        <ol key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={index}>
        {renderInlineMarkdown(block.text)}
      </p>
    );
  });
}

/* =========================================================
   RICH HTML DETECTION
   ========================================================= */

function isRichHtml(content = "") {
  return /<\/?(p|h[1-6]|ul|ol|li|blockquote|pre|code|strong|em|s|a)\b/i.test(
    content
  );
}

/* =========================================================
   ARTICLE CONTENT
   ========================================================= */

function ArticleContent({ content }) {
  const value = content || "";

  if (!isRichHtml(value)) {
    return <>{renderMarkdown(value)}</>;
  }

  const safeHtml = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "a",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: safeHtml,
      }}
    />
  );
}

/* =========================================================
   ARTICLE DETAIL PAGE
   ========================================================= */

function ArticleDetail() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticle() {
      setLoading(true);
      setError("");
      setArticle(null);

      try {
        if (!slug) {
          throw new Error("Article not found.");
        }

        const result = await api.getArticleBySlug(
          slug,
          controller.signal
        );

        if (!result?.success || !result?.data) {
          throw new Error("Article not found.");
        }

        setArticle(result.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Unable to load article:", err);

          setError(
            err.message || "Unable to load this article."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchArticle();

    return () => controller.abort();
  }, [slug]);

  /* Loading state */

  if (loading) {
    return (
      <main className="article-detail-page">
        <div className="article-detail-inner">
          <p role="status" aria-live="polite">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  /* Error / not found state */

  if (error || !article) {
    return (
      <main className="article-detail-page">
        <div className="article-detail-inner">
          <Link className="article-back-link" to="/">
            <ArrowLeft size={17} />
            Back to BestXWorst
          </Link>

          <h1 className="article-detail-title">
            Article not found
          </h1>

          <p
            className="article-detail-excerpt"
            role="alert"
          >
            {error ||
              "This article may no longer be available."}
          </p>

          <Link className="article-back-link" to="/">
            Explore more articles
          </Link>
        </div>
      </main>
    );
  }

  /* Publication date */

  const date = article.publishedAt
    ? new Date(article.publishedAt)
    : null;

  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    <main className="article-detail-page">
      <div className="article-detail-inner">
        <Link className="article-back-link" to="/">
          <ArrowLeft size={17} />
          Back to BestXWorst
        </Link>

        <p className="article-detail-category">
          {article.category || "Reviews"}
        </p>

        <h1 className="article-detail-title">
          {article.title || "Untitled article"}
        </h1>

        {article.excerpt && (
          <p className="article-detail-excerpt">
            {article.excerpt}
          </p>
        )}

        <div className="article-detail-meta">
          <span>
            <UserRound size={16} />
            {article.author || "BestXWorst Editorial Team"}
          </span>

          {formattedDate && (
            <span>
              <CalendarDays size={16} />
              {formattedDate}
            </span>
          )}
        </div>

        {article.featuredImage && (
          <img
            className="article-detail-image"
            src={article.featuredImage}
            alt={
              article.title || "Article featured image"
            }
            loading="lazy"
          />
        )}

        <article className="article-detail-content">
          <ArticleContent content={article.content} />
        </article>

        <Link className="article-back-link" to="/">
          <ArrowLeft size={17} />
          Explore more articles
        </Link>
      </div>
    </main>
  );
}

export default ArticleDetail;
