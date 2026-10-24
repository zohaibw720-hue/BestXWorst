
import { Link } from "react-router-dom";

function Footer() {
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
        { label: "Our approach", to: "/#method" },
        { label: "About BestXWorst", to: "/about/" },
        { label: "Editorial standards", to: "/editorial-standards/" },
        { label: "How we test", to: "/how-we-test/" },
        { label: "Contact", to: "/contact/" },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" to="/">
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
          </p>
        </div>

        <div className="footer-links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <span className="footer-heading">{group.title}</span>

              {group.links.map((item) => (
                <Link key={item.label} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} BESTXWORST. ALL RIGHTS RESERVED.
        </span>

        <span>INDEPENDENTLY MINDED. ALWAYS INFORMED.</span>

        <a href="#home">BACK TO TOP ↑</a>
      </div>

      <div className="footer-big-wordmark">
        <Link to="/" aria-label="BestXWorst homepage">
          BEST<span className="wordmark-x">X</span>WORS
          <span className="footer-wordmark-final-t">T</span>
          <span className="wordmark-period">.</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
