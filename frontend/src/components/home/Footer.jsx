import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const footerGroups = [
    {
      title: "EXPLORE",
      links: [
        { label: "Latest reviews", to: "/reviews/" },
        { label: "Best picks", to: "/best/" },
        { label: "Versus comparisons", to: "/versus/" },
        { label: "Worst picks", to: "/worst/" },
      ],
    },
    {
      title: "CATEGORIES",
      links: [
        { label: "Technology", to: "/technology/" },
        { label: "AI & Software", to: "/ai-software/" },
        { label: "Home & Living", to: "/home/" },
        { label: "Cars & Mobility", to: "/cars/" },
        { label: "Beauty", to: "/beauty/" },
        { label: "Fashion", to: "/fashion/" },
        { label: "Travel", to: "/travel/" },
        { label: "How-To Guides", to: "/how-to/" },
      ],
    },
    {
      title: "OUR STANDARDS",
      links: [
        { label: "Our approach", to: "/#method", anchor: "method" },
        { label: "About BestXWorst", to: "/about/" },
        { label: "Editorial standards", to: "/editorial-standards/" },
        { label: "How we test", to: "/how-we-test/" },
        { label: "Contact", to: "/contact/" },
      ],
    },
  ];

  function handleAnchorNavigation(event, anchorId) {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return;
    }

    document.getElementById(anchorId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `/#${anchorId}`);
  }

  function handleBackToTop(event) {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link
            className="wordmark footer-wordmark"
            to="/"
            aria-label="BestXWorst homepage"
          >
            BEST<span className="wordmark-x">X</span>WORST
            <span className="wordmark-period">.</span>
          </Link>

          <p className="footer-tagline">
            Know the best.
            <br />
            Avoid the worst.
          </p>

          <p className="footer-description">
            Independent consumer reviews and comparisons.
            Evidence before opinion.
          </p>
        </div>

        <div className="footer-links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <span className="footer-heading">{group.title}</span>

              {group.links.map((item) =>
                item.anchor ? (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={(event) =>
                      handleAnchorNavigation(event, item.anchor)
                    }
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.to}>
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} BESTXWORST. ALL RIGHTS RESERVED.
        </span>

        <span>INDEPENDENTLY MINDED. ALWAYS INFORMED.</span>

        <a href="#top" onClick={handleBackToTop}>
          BACK TO TOP ↑
        </a>
      </div>

      <div className="footer-big-wordmark" aria-hidden="true">
        <Link to="/" tabIndex={-1}>
          BEST<span className="wordmark-x">X</span>WORS
          <span className="footer-wordmark-final-t">T</span>
          <span className="wordmark-period">.</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
