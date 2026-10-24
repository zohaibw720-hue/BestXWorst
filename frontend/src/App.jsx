
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "./components/layout/Header.jsx";
import LatestArticles from "./components/articles/LatestArticles.jsx";
import ArticleTypeSection from "./components/articles/ArticleTypeSection.jsx";

import Hero from "./components/home/Hero.jsx";
import BestVsWorst from "./components/home/BestVsWorst.jsx";
import MethodSection from "./components/home/MethodSection.jsx";
import Footer from "./components/home/Footer.jsx";

import ArticleDetail from "./pages/ArticleDetail.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminContactMessages from "./pages/AdminContactMessages.jsx";

import ArticlesList from "./admin/pages/ArticlesList.jsx";
import ArticleForm from "./admin/pages/ArticleForm.jsx";

import {
  AboutPage,
  EditorialStandardsPage,
  HowWeTestPage,
  ContactPage,
} from "./pages/InfoPage.jsx";

import "./App.css";
import "./HomePage.css";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/articles";

/* =========================================================
   ADMIN PROTECTED ROUTE
   ========================================================= */

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

/* =========================================================
   HOME PAGE
   ========================================================= */

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const search =
    new URLSearchParams(location.search).get("search") ?? "";

  /* Fetch articles from the backend */

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
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
            "The articles API returned an unexpected response."
          );
        }

        setArticles(result.data);
        setError("");
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        console.error(
          "BestXWorst articles request failed:",
          fetchError
        );

        setError(
          "Unable to load articles. Please check your backend connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadArticles();

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  /* Retry article loading */

  function retryLoadingArticles() {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  }

  /* Keep the search value synchronized with the URL */

  function handleSearchChange(value) {
    const params = new URLSearchParams(location.search);
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("search", trimmedValue);
    } else {
      params.delete("search");
    }

    const nextSearch = params.toString();

    navigate(
      {
        pathname: "/",
        search: nextSearch ? `?${nextSearch}` : "",
        hash: location.hash,
      },
      {
        replace: true,
      }
    );
  }

  /* Show editorial collections only when appropriate */

  const showEditorialSections =
    !loading && !error && !search.trim();

  return (
    <>
      <Header
        search={search}
        setSearch={handleSearchChange}
      />

      <main>
        <Hero />

        <div
          className="editorial-strip"
          aria-label="Our editorial focus"
        >
          <span>BUILT FOR THE CURIOUS.</span>

          <span className="strip-star" aria-hidden="true">
            ✳
          </span>

          <span>DESIGN. PERFORMANCE. TECHNOLOGY.</span>

          <span className="strip-star" aria-hidden="true">
            ✳
          </span>

          <span>INDEPENDENT PERSPECTIVE.</span>
        </div>

        {showEditorialSections && (
          <>
            <ArticleTypeSection
              articles={articles}
              type="best"
              eyebrow="THE SHORTLIST"
              title="The best picks."
              description="Products and services that stand out for their quality, performance, and value."
              link="/best/"
              linkLabel="EXPLORE ALL BEST PICKS"
            />

            <ArticleTypeSection
              articles={articles}
              type="worst"
              eyebrow="THE RED FLAGS"
              title="The worst picks."
              description="The drawbacks, disappointments, and costly compromises worth knowing about."
              link="/worst/"
              linkLabel="EXPLORE ALL WORST PICKS"
            />

            <ArticleTypeSection
              articles={articles}
              type="versus"
              eyebrow="HEAD TO HEAD"
              title="Versus comparisons."
              description="Side-by-side comparisons that help you understand the differences before choosing."
              link="/versus/"
              linkLabel="EXPLORE ALL COMPARISONS"
            />
          </>
        )}

        <LatestArticles
          articles={articles}
          loading={loading}
          error={error}
          onRetry={retryLoadingArticles}
          search={search}
          category={category}
          setCategory={setCategory}
          setSearch={handleSearchChange}
        />

        <BestVsWorst />

        <MethodSection />
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   SCROLL TO TOP
   ========================================================= */

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView();
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [pathname, hash]);

  return null;
}

/* =========================================================
   NOT FOUND PAGE
   ========================================================= */

function NotFoundPage() {
  return (
    <main className="article-detail-page">
      <div className="article-detail-inner">
        <h1>Page not found</h1>

        <p>
          The page you're looking for doesn't exist or may have moved.
        </p>

        <Link to="/">Back to homepage</Link>
      </div>
    </main>
  );
}

/* =========================================================
   APPLICATION ROUTES
   ========================================================= */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Admin home */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        {/* Admin login */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Admin dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Admin article management */}

        <Route
          path="/admin/articles"
          element={
            <AdminProtectedRoute>
              <ArticlesList />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/articles/new"
          element={
            <AdminProtectedRoute>
              <ArticleForm />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/articles/edit/:id"
          element={
            <AdminProtectedRoute>
              <ArticleForm />
            </AdminProtectedRoute>
          }
        />

        {/* Admin contact messages */}

        <Route
          path="/admin/messages"
          element={
            <AdminProtectedRoute>
              <AdminContactMessages />
            </AdminProtectedRoute>
          }
        />

        {/* Homepage */}

        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Article details */}

        <Route
          path="/article/:slug"
          element={<ArticleDetail />}
        />

        {/* Informational pages */}

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/editorial-standards"
          element={<EditorialStandardsPage />}
        />

        <Route
          path="/how-we-test"
          element={<HowWeTestPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        {/* Category pages */}

        <Route
          path="/:categorySlug"
          element={<CategoryPage />}
        />

        {/* Fallback route */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
