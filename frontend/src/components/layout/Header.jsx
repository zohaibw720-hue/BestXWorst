
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleSearch() {
    setSearchOpen((open) => !open);
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
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <Link
          className="wordmark"
          to="/"
          aria-label="BestXWorst homepage"
          onClick={closeMenu}
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

          <Link className="header-cta" to="/reviews/">
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
            className={({ isActive }) =>
              `main-nav-link${isActive ? " main-nav-link-active" : ""}`
            }
            onClick={closeMenu}
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
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(search.trim());
            setSearchOpen(false);
            closeMenu();

            if (window.location.pathname !== "/") {
              window.location.assign(
                `/?search=${encodeURIComponent(search.trim())}#latest`
              );
            } else {
              document.getElementById("latest")?.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
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
