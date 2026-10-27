
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const heroSlides = [
  {
    label: "TECHNOLOGY",
    kicker: "Technology · Expert Reviews",
    title: "Technology that earns its place.",
    description:
      "Discover the devices and innovations worth your attention, backed by evidence rather than hype.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=90",
    alt: "Electronic circuit board with detailed components",
    path: "/technology/",
    cta: "Explore technology",
  },
  {
    label: "AI & SOFTWARE",
    kicker: "Artificial Intelligence · Software",
    title: "Smarter tools. Better decisions.",
    description:
      "Explore AI tools and software through practical comparisons, clear testing and independent analysis.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2400&q=90",
    alt: "Artificial intelligence and digital technology scene",
    path: "/ai-software/",
    cta: "Explore AI & software",
  },
  {
    label: "HOME & LIVING",
    kicker: "Home · Everyday Essentials",
    title: "Make every choice count at home.",
    description:
      "Find useful home products and everyday essentials that deliver real value and practical performance.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90",
    alt: "Contemporary living room with natural lighting",
    path: "/home/",
    cta: "Explore home",
  },
  {
    label: "CARS",
    kicker: "Automotive · Performance",
    title: "Know what drives the difference.",
    description:
      "Compare cars, explore automotive technology and understand what matters before making a decision.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=90",
    alt: "Sports car in a dramatic setting",
    path: "/cars/",
    cta: "Explore cars",
  },
  {
    label: "BEAUTY",
    kicker: "Beauty · Personal Care",
    title: "Find what works for you.",
    description:
      "Explore beauty and personal-care products with practical insights into ingredients, performance and value.",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=2400&q=90",
    alt: "Skincare products in a clean editorial setting",
    path: "/beauty/",
    cta: "Explore beauty",
  },
  {
    label: "FASHION",
    kicker: "Fashion · Style",
    title: "Style with a sharper perspective.",
    description:
      "Discover fashion essentials and style choices through thoughtful reviews and clear comparisons.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=90",
    alt: "Fashion editorial photography",
    path: "/fashion/",
    cta: "Explore fashion",
  },
  {
    label: "TRAVEL",
    kicker: "Travel · Experiences",
    title: "Choose your next adventure wisely.",
    description:
      "Explore travel essentials, useful gear and smarter choices for journeys worth remembering.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90",
    alt: "Mountain landscape with distant peaks",
    path: "/travel/",
    cta: "Explore travel",
  },
];

const SLIDE_INTERVAL = 6000;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <section
      className="hero-section hero-section-full automotive-hero"
      id="home"
      aria-label="BestXWorst featured categories"
    >
      {/* Background photos only — no category labels or counters */}
      <div className="hero-visual hero-visual-background">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.label}
            className={`hero-image hero-background-image ${
              index === activeSlide ? "hero-background-image-active" : ""
            }`}
            src={slide.image}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            draggable="false"
          />
        ))}

        <div className="hero-image-overlay" />
      </div>

      {/* Main hero content remains separate from the background images */}
      <div
        className="hero-copy hero-overlay-copy automotive-hero-copy"
        key={currentSlide.label}
      >
        <div className="eyebrow hero-eyebrow-light">
          <span className="red-dot" />
          Independent Reviews. Better Decisions.
        </div>

        <h1>
          Know the Best.
          <br />
          Avoid the <span className="red-period">Worst.</span>
        </h1>

        <p className="hero-description">
          Independent reviews, evidence-led comparisons and honest insights
          to help you choose with confidence.
        </p>

        <div className="hero-slide-story">
          <span className="caption-kicker">{currentSlide.kicker}</span>

          <h2>{currentSlide.title}</h2>

          <p>{currentSlide.description}</p>
        </div>

        <div className="hero-actions automotive-hero-actions">
          <Link
            className="button-primary automotive-primary-button"
            to={currentSlide.path}
          >
            {currentSlide.cta}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <Link className="text-link hero-text-link" to="/reviews/">
            Explore all reviews
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="hero-bottom-note hero-bottom-note-light">
          <span>Evidence before opinion</span>
          <span className="note-divider" />
          <span>Independent editorial standards</span>
        </div>
      </div>

      {/* Slider controls */}
      <div className="hero-slider-controls hero-controls-overlay">
        <button
          type="button"
          className="slider-next slider-previous"
          onClick={() => goToSlide(activeSlide - 1)}
          aria-label="Previous featured category"
        >
          <ArrowRight size={17} aria-hidden="true" />
        </button>

        {heroSlides.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            className={`slider-indicator ${
              index === activeSlide ? "slider-indicator-active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Show ${slide.label.toLowerCase()} slide`}
            aria-current={index === activeSlide ? "true" : undefined}
          />
        ))}

        <button
          type="button"
          className="slider-next"
          onClick={() => goToSlide(activeSlide + 1)}
          aria-label="Next featured category"
        >
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
