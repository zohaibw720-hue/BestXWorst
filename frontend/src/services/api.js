
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://bestxworst-backend.vercel.app/api"
).replace(/\/+$/, "");

async function apiRequest(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  let token = null;

  try {
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("adminToken");
    }
  } catch {
    // Continue without a token if localStorage is unavailable.
  }

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Unable to connect to the server. Please check your internet connection and try again.",
      { cause: error }
    );
  }

  let result;

  try {
    result = await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    result = {};
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
        `Request failed with status ${response.status}. Please try again.`
    );
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