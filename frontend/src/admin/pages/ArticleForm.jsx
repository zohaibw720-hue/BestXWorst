
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  FileText,
  LoaderCircle,
  RefreshCw,
  X,
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Upload,
  Unlink,
} from "lucide-react";
import "../styles/ArticleForm.css";

const API_URL = "http://localhost:5000/api/articles";
const UPLOAD_URL = "http://localhost:5000/api/upload/image";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Technology",
  articleType: "review",
  featuredImage: "",
  author: "",
  status: "draft",
};

const categories = [
  "Technology",
  "AI & Software",
  "Cars",
  "Home & Living",
  "Lifestyle",
  "Beauty",
  "Fashion",
  "Travel",
  "How-To",
];

const articleTypes = [
  { value: "review", label: "Review / Regular Article" },
  { value: "best", label: "Best Pick" },
  { value: "worst", label: "Worst Pick" },
  { value: "versus", label: "Versus Comparison" },
];

function createSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getArticleArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.articles)) return data.articles;
  return [];
}

function hasReadableContent(html = "") {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

  return Boolean(text);
}

function ArticleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const imageInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor: currentEditor }) => {
      setForm((current) => ({
        ...current,
        content: currentEditor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class: "article-rich-editor",
        "aria-label": "Article content editor",
      },
    },
  });

  useEffect(() => {
    if (!isEditing) return undefined;

    const controller = new AbortController();

    async function loadArticle() {
      setLoading(true);
      setError("");

      try {
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

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Articles load nahi ho sake."
          );
        }

        const articleList = getArticleArray(data);
        const article = articleList.find(
          (item) => String(item._id) === String(id)
        );

        if (!article) {
          throw new Error(
            "Article nahi mila. Articles list refresh karke dobara try karein."
          );
        }

        setForm({
          title: article.title || "",
          slug: article.slug || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          category: article.category || "Technology",
          articleType: article.articleType || "review",
          featuredImage: article.featuredImage || "",
          author: article.author || "",
          status: article.status || "draft",
        });

        setSlugManuallyEdited(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Article load karte waqt error aaya."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => controller.abort();
  }, [id, isEditing, navigate, loadAttempt]);

  // Existing article ka content editor mein load karein.
  useEffect(() => {
    if (!editor || loading || !isEditing) return;

    editor.commands.setContent(form.content || "", {
      emitUpdate: false,
    });
    // Run when the article is initially loaded or explicitly reloaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, loading, isEditing, id, loadAttempt]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => {
      const updated = { ...current, [name]: value };

      if (name === "title" && !slugManuallyEdited) {
        updated.slug = createSlug(value);
      }

      return updated;
    });

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setError("");
  }

  function retryLoadingArticle() {
    setError("");
    setLoadAttempt((attempt) => attempt + 1);
  }

  function insertLink() {
    if (!editor) return;

    const existingUrl = editor.getAttributes("link").href || "";
    const enteredUrl = window.prompt(
      "Enter the full link URL (https://...)",
      existingUrl
    );

    if (enteredUrl === null) return;

    const url = enteredUrl.trim();

    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch {
      setError("Valid URL enter karein, jaise https://example.com");
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    // Same image ko dobara select karne par bhi change event fire ho.
    event.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Sirf JPG, PNG, WEBP ya GIF image select karein.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image ka size 5 MB ya us se kam hona chahiye.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploadingImage(true);
      setError("");

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.url) {
        throw new Error(
          data.message || "Image upload nahi ho saki."
        );
      }

      setForm((current) => ({
        ...current,
        featuredImage: data.url,
      }));
    } catch (err) {
      setError(err.message || "Image upload mein error aaya.");
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage() {
    setForm((current) => ({
      ...current,
      featuredImage: "",
    }));
    setError("");
  }

  async function handleSubmit(event, requestedStatus) {
    event.preventDefault();

    if (saving || uploadingImage) return;

    setError("");

    const title = form.title.trim();
    const slug = createSlug(form.slug || form.title);
    const excerpt = form.excerpt.trim();
    const content = editor ? editor.getHTML() : form.content;

    if (!title) {
      setError("Article title required hai.");
      return;
    }

    if (!slug) {
      setError("Valid URL slug enter karein.");
      return;
    }

    if (!hasReadableContent(content)) {
      setError("Article content required hai.");
      return;
    }

    if (!categories.includes(form.category)) {
      setError("Valid category select karein.");
      return;
    }

    if (!articleTypes.some((type) => type.value === form.articleType)) {
      setError("Valid article type select karein.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const payload = {
      ...form,
      title,
      slug,
      excerpt,
      content,
      category: form.category,
      articleType: form.articleType,
      featuredImage: form.featuredImage.trim(),
      author: form.author.trim(),
      status: requestedStatus,
    };

    try {
      setSaving(true);

      const response = await fetch(
        isEditing ? `${API_URL}/${id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Article save nahi ho saka. Dobara try karein."
        );
      }

      navigate("/admin/articles", {
        replace: true,
        state: {
          message:
            requestedStatus === "published"
              ? "Article successfully published."
              : "Article successfully saved as draft.",
        },
      });
    } catch (err) {
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="article-form-page">
        <div className="article-form-loading">
          <LoaderCircle size={30} className="article-form-spinner" />
          <p>Article load ho raha hai...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="article-form-page">
      <div className="article-form-container">
        <Link to="/admin/articles" className="article-form-back">
          <ArrowLeft size={17} />
          Back to Articles
        </Link>

        <header className="article-form-header">
          <div>
            <p className="article-form-eyebrow">
              CONTENT MANAGEMENT
            </p>

            <h1>{isEditing ? "Edit Article" : "Create Article"}</h1>

            <p>
              {isEditing
                ? "Apne article ki details update karein."
                : "BestXWorst ke liye naya article create karein."}
            </p>
          </div>

          <div className="article-form-header-icon">
            <FileText size={25} />
          </div>
        </header>

        {error && (
          <div
            className="article-form-alert article-form-alert-error"
            role="alert"
          >
            <p>{error}</p>

            {isEditing && (
              <button
                type="button"
                className="article-form-cancel"
                onClick={retryLoadingArticle}
              >
                <RefreshCw size={16} />
                Retry loading article
              </button>
            )}
          </div>
        )}

        <form
          className="article-form"
          onSubmit={(event) => handleSubmit(event, "draft")}
        >
          <section className="article-form-card">
            <div className="article-form-section-heading">
              <FileText size={19} />

              <div>
                <h2>Article Details</h2>
                <p>
                  Title, category aur basic information enter karein.
                </p>
              </div>
            </div>

            <div className="article-form-field">
              <label htmlFor="article-title">Article Title *</label>

              <input
                id="article-title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter article title"
                maxLength={200}
                required
              />
            </div>

            <div className="article-form-field">
              <label htmlFor="article-slug">URL Slug *</label>

              <input
                id="article-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                placeholder="my-article-title"
                required
              />

              <small>
                Article URL: /article/
                {createSlug(form.slug || form.title) || "your-article"}
              </small>
            </div>

            <div className="article-form-grid">
              <div className="article-form-field">
                <label htmlFor="article-category">Category *</label>

                <select
                  id="article-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <small>Article ki main subject category select karein.</small>
              </div>

              <div className="article-form-field">
                <label htmlFor="article-type">Article Type *</label>

                <select
                  id="article-type"
                  name="articleType"
                  value={form.articleType}
                  onChange={handleChange}
                  required
                >
                  {articleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <small>
                  Review, Best Pick, Worst Pick ya Versus Comparison.
                </small>
              </div>
            </div>

            <div className="article-form-field">
              <label htmlFor="article-author">Author</label>

              <input
                id="article-author"
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name"
              />
            </div>

            <div className="article-form-field">
              <label htmlFor="article-excerpt">Excerpt</label>

              <textarea
                id="article-excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write a short summary of your article..."
                rows={3}
                maxLength={500}
              />

              <small>
                Short summary jo homepage aur article previews mein show ho
                sakti hai.
              </small>
            </div>
          </section>

          <section className="article-form-card">
            <div className="article-form-section-heading">
              <ImageIcon size={19} />

              <div>
                <h2>Featured Image</h2>
                <p>
                  Computer se image select karein ya image URL enter karein.
                </p>
              </div>
            </div>

            <div className="article-form-image-actions">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                hidden
              />

              <button
                type="button"
                className="article-form-upload-button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage || saving}
              >
                {uploadingImage ? (
                  <LoaderCircle
                    size={17}
                    className="article-form-spinner"
                  />
                ) : (
                  <Upload size={17} />
                )}
                {uploadingImage ? "Uploading image..." : "Choose Image"}
              </button>

              <small>JPG, PNG, WEBP or GIF · Maximum 5 MB</small>
            </div>

            <div className="article-form-field">
              <label htmlFor="article-image">Image URL</label>

              <input
                id="article-image"
                name="featuredImage"
                type="url"
                value={form.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              <small>
                Upload ki hui image ka URL yahan automatically aa jayega.
              </small>
            </div>

            {form.featuredImage.trim() && (
              <div className="article-form-image-preview">
                <img
                  src={form.featuredImage}
                  alt="Featured image preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />

                <button
                  type="button"
                  className="article-form-remove-image"
                  onClick={removeImage}
                  disabled={saving || uploadingImage}
                >
                  <X size={16} />
                  Remove image
                </button>
              </div>
            )}
          </section>

          <section className="article-form-card">
            <div className="article-form-section-heading">
              <FileText size={19} />

              <div>
                <h2>Article Content</h2>
                <p>Toolbar use karke apne article ko format karein.</p>
              </div>
            </div>

            {editor && (
              <div
                className="article-editor-toolbar"
                role="toolbar"
                aria-label="Article formatting toolbar"
              >
                <button
                  type="button"
                  title="Bold"
                  aria-label="Bold"
                  className={editor.isActive("bold") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                  <Bold size={17} />
                </button>

                <button
                  type="button"
                  title="Italic"
                  aria-label="Italic"
                  className={editor.isActive("italic") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                  <Italic size={17} />
                </button>

                <button
                  type="button"
                  title="Strikethrough"
                  aria-label="Strikethrough"
                  className={editor.isActive("strike") ? "is-active" : ""}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                >
                  <Strikethrough size={17} />
                </button>

                <span className="article-editor-toolbar-divider" />

                <button
                  type="button"
                  title="Heading 2"
                  aria-label="Heading 2"
                  className={
                    editor.isActive("heading", { level: 2 })
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  <Heading2 size={18} />
                </button>

                <button
                  type="button"
                  title="Heading 3"
                  aria-label="Heading 3"
                  className={
                    editor.isActive("heading", { level: 3 })
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  <Heading3 size={18} />
                </button>

                <span className="article-editor-toolbar-divider" />

                <button
                  type="button"
                  title="Bullet list"
                  aria-label="Bullet list"
                  className={editor.isActive("bulletList") ? "is-active" : ""}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <List size={18} />
                </button>

                <button
                  type="button"
                  title="Numbered list"
                  aria-label="Numbered list"
                  className={
                    editor.isActive("orderedList") ? "is-active" : ""
                  }
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrdered size={18} />
                </button>

                <span className="article-editor-toolbar-divider" />

                <button
                  type="button"
                  title="Add or edit link"
                  aria-label="Add or edit link"
                  className={editor.isActive("link") ? "is-active" : ""}
                  onClick={insertLink}
                >
                  <LinkIcon size={17} />
                </button>

                {editor.isActive("link") && (
                  <button
                    type="button"
                    title="Remove link"
                    aria-label="Remove link"
                    onClick={() =>
                      editor.chain().focus().unsetLink().run()
                    }
                  >
                    <Unlink size={17} />
                  </button>
                )}

                <span className="article-editor-toolbar-divider" />

                <button
                  type="button"
                  title="Undo"
                  aria-label="Undo"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo2 size={17} />
                </button>

                <button
                  type="button"
                  title="Redo"
                  aria-label="Redo"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo2 size={17} />
                </button>
              </div>
            )}

            <div className="article-form-field">
              <label>Content *</label>

              <div className="article-rich-editor-shell">
                <EditorContent editor={editor} />
              </div>

              <small>
                Text select karein aur toolbar se formatting apply karein.
                Purane Markdown articles ko editor mein kholne se pehle
                unka format check karein.
              </small>
            </div>
          </section>

          <section className="article-form-publish-card">
            <div>
              <h2>Ready to publish?</h2>
              <p>
                Draft save karein ya article ko public website par publish
                karein.
              </p>
            </div>

            <div className="article-form-actions">
              <button
                type="button"
                className="article-form-cancel"
                onClick={() => navigate("/admin/articles")}
                disabled={saving || uploadingImage}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="article-form-save"
                disabled={saving || uploadingImage}
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="article-form-spinner"
                  />
                ) : (
                  <Save size={17} />
                )}
                Save Draft
              </button>

              <button
                type="button"
                className="article-form-publish"
                disabled={saving || uploadingImage}
                onClick={(event) => handleSubmit(event, "published")}
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="article-form-spinner"
                  />
                ) : (
                  <Send size={17} />
                )}
                Publish Article
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}

export default ArticleForm;
