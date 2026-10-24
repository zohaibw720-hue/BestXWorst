
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed. Please try again.");
  }

  return result;
}

export const api = {
  getArticles: () => apiRequest("/articles"),

  getArticleBySlug: (slug, signal) =>
    apiRequest(`/articles/slug/${encodeURIComponent(slug)}`, {
      signal,
    }),

  getArticleById: (id) =>
    apiRequest(`/articles/${encodeURIComponent(id)}`),

  adminLogin: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getAdminArticles: () => apiRequest("/articles/admin/all"),

  createArticle: (article) =>
    apiRequest("/articles", {
      method: "POST",
      body: JSON.stringify(article),
    }),

  updateArticle: (id, article) =>
    apiRequest(`/articles/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(article),
    }),

  deleteArticle: (id) =>
    apiRequest(`/articles/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
