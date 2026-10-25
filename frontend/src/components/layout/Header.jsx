
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import "./Header.css";

const navigation = [
  { label: "REVIEWS", path: "/reviews/" },
  { label: "BEST PICKS", path: "/best/" },
  { label: "VERSUS", path: "/versus/" },
  { label: "WORST PICKS", path: "/worst/" },
  { label: "TECHNOLOGY", path: "/technology/" },
  { label: "AI & SOFTWARE", path: "/ai-software/" },
  { label: "HOME & LIVING", path: "/home/" },
  { label: "CARS", path: "/cars/" },
  { label: "BEAUTY", path: "/beauty/" },
  { label: "FASHION", path: "/fashion/" },
  { label: "TRAVEL", path: "/travel/" },
  { label: "HOW-TO", path: "/how-to/" },
];

function Header({ search = "", setSearch = () => {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
  }

  function toggleSearch() {
    setSearchOpen((open) => !open);
    closeMenu();
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    setSearch(trimmedSearch);
    closeSearch();
    closeMenu();

    if (location.pathname !== "/") {
      navigate({
        pathname: "/",
        search: trimmedSearch
          ? `?search=${encodeURIComponent(trimmedSearch)}`
          : "",
        hash: "#latest",
      });
      return;
    }

    if (trimmedSearch) {
      navigate({
        pathname: "/",
        search: `?search=${encodeURIComponent(trimmedSearch)}`,
        hash: "#latest",
      });
    } else {
      navigate({
        pathname: "/",
        search: "",
        hash: "#latest",
      });
    }

    requestAnimationFrame(() => {
      document.getElementById("latest")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  return (
    <header className="site-header" id="home">
      <div className="topline">
        <span>INDEPENDENT REVIEWS. BETTER DECISIONS.</span>

        <span className="topline-right">
          LESS HYPE
          <span className="topline-dot" aria-hidden="true">
            ✳
          </span>
          MORE CLARITY
        </span>
      </div>

      <div className="masthead">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setMenuOpen((open) => !open);
            closeSearch();
          }}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <Link
          className="wordmark"
          to="/"
          aria-label="BestXWorst homepage"
          onClick={() => {
            closeMenu();
            closeSearch();
          }}
        >
          BEST<span className="wordmark-x">X</span>WORST
          <span className="wordmark-period">.</span>
        </Link>

        <p className="masthead-tagline">
          KNOW THE BEST.
          <br />
          AVOID THE WORST.
        </p>

        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="site-search-panel"
            onClick={toggleSearch}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          <Link
            className="header-cta"
            to="/reviews/"
            onClick={() => {
              closeMenu();
              closeSearch();
            }}
          >
            EXPLORE REVIEWS
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <nav
        className={`main-nav ${menuOpen ? "main-nav-open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `main-nav-link${isActive ? " main-nav-link-active" : ""}`
            }
            onClick={() => {
              closeMenu();
              closeSearch();
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {searchOpen && (
        <form
          className="search-panel"
          id="site-search-panel"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews, products and comparisons..."
            aria-label="Search reviews, products and comparisons"
          />

          {search && (
            <button
              className="icon-button search-clear-button"
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={17} />
            </button>
          )}

          <button className="search-submit" type="submit">
            SEARCH
            <ArrowUpRight size={15} />
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;
