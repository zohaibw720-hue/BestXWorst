
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    label: "Independent Reviews",
    kicker: "BEHIND THE WHEEL",
    title: "Engineering. Emotion. Excellence.",
    description:
      "Discover the performance, technology, and design that make a car worth your attention.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90",
    alt: "Porsche sports car photographed in a cinematic automotive setting",
  },
  {
    label: "Performance & Design",
    kicker: "BEYOND THE BADGE",
    title: "The details make the difference.",
    description:
      "Look beyond the badge to discover what makes a car genuinely worth considering.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=90",
    alt: "Premium automobile showcasing its exterior design",
  },
  {
    label: "Technology & Innovation",
    kicker: "THE ROAD AHEAD",
    title: "What deserves your attention?",
    description:
      "Explore the innovations, thoughtful engineering, and features that make a meaningful difference.",
    image:
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=2400&q=90",
    alt: "Modern performance car photographed in a dramatic setting",
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  function nextSlide() {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  }

  function previousSlide() {
    setActiveSlide(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length
    );
  }

  return (
    <section
      className="hero-section hero-section-full automotive-hero"
      id="home"
    >
      <div
        className="hero-visual hero-visual-background"
        aria-label="Featured automotive stories"
      >
        {heroSlides.map((item, index) => (
          <img
            key={item.image}
            className={`hero-image hero-background-image ${
              activeSlide === index ? "hero-background-image-active" : ""
            }`}
            src={item.image}
            alt={item.alt}
            aria-hidden={activeSlide !== index}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}

        <div className="hero-image-overlay" />
      </div>

      <div className="hero-image-top hero-overlay-top">
        <span className="image-label">{slide.label}</span>

        <span className="image-counter" aria-live="polite">
          0{activeSlide + 1} <span>/ 0{heroSlides.length}</span>
        </span>
      </div>

      <div className="hero-copy hero-overlay-copy automotive-hero-copy">
        <div className="eyebrow hero-eyebrow-light">
          <span className="red-dot" />
          Independent automotive reviews
        </div>

        <h1>
          Find your
          <br />
          <span>next</span> obsession
          <span className="red-period">.</span>
        </h1>

        <p className="hero-description">
          Discover exceptional cars, intelligent engineering, and the
          technology shaping the road ahead. Independent insights,
          evidence-led reviews, and clear verdicts without the hype.
        </p>

        <div className="hero-slide-story" key={slide.title}>
          <span className="caption-kicker">{slide.kicker}</span>

          <h2>{slide.title}</h2>

          <p>{slide.description}</p>
        </div>

        <div className="hero-actions automotive-hero-actions">
          <a
            className="button-primary automotive-primary-button"
            href="#latest"
          >
            Explore car reviews <ArrowRight size={17} />
          </a>

          <Link className="text-link hero-text-link" to="/cars/">
            Discover the car edit <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="hero-bottom-note hero-bottom-note-light">
          <span>Design &amp; engineering</span>
          <span className="note-divider" />
          <span>Independent perspective</span>
        </div>
      </div>

      <div className="hero-slider-controls hero-controls-overlay">
        <button
          type="button"
          className="slider-next slider-previous"
          aria-label="Previous featured story"
          onClick={previousSlide}
        >
          <ArrowRight size={19} />
        </button>

        {heroSlides.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`slider-indicator ${
              activeSlide === index ? "slider-indicator-active" : ""
            }`}
            aria-label={`Show slide ${index + 1}`}
            aria-pressed={activeSlide === index}
            onClick={() => setActiveSlide(index)}
          />
        ))}

        <button
          type="button"
          className="slider-next"
          aria-label="Next featured story"
          onClick={nextSlide}
        >
          <ArrowRight size={19} />
        </button>
      </div>
    </section>
  );
}

export default Hero;
