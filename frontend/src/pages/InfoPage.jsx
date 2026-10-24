
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Mail,
  MessageSquare,
  ShieldCheck,
  Target,
} from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/home/Footer";
import "./InfoPage.css";

const CONTACT_EMAIL = "contact@example.com";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  subject: "General enquiry",
  message: "",
};

const pageContent = {
  about: {
    eyebrow: "ABOUT BESTXWORST",
    title: "Know the Best. Avoid the Worst.",
    description:
      "Clear reviews, thoughtful comparisons, and evidence-led guidance to help you make more informed decisions.",
    icon: Target,
  },

  standards: {
    eyebrow: "OUR EDITORIAL PROMISE",
    title: "Evidence before opinion.",
    description:
      "Learn how we approach accuracy, independence, corrections, commercial relationships, and reader trust.",
    icon: ShieldCheck,
  },

  testing: {
    eyebrow: "OUR METHODOLOGY",
    title: "How we evaluate products.",
    description:
      "Understand what we assess, what evidence informs our conclusions, and where the limitations remain.",
    icon: ClipboardCheck,
  },
};

function InfoHero({ eyebrow, title, description, Icon }) {
  return (
    <section className="info-hero">
      <div className="info-hero__inner">
        <div className="info-hero__copy">
          <span className="info-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="info-hero__symbol" aria-hidden="true">
          <Icon size={64} strokeWidth={1.1} />
        </div>
      </div>
    </section>
  );
}

function InfoSectionHeading({ eyebrow, title, children }) {
  return (
    <section className="info-section">
      <span className="info-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function InfoInlineLink({ to, children }) {
  return (
    <Link className="info-inline-link" to={to}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}

function InformationPage({ type }) {
  const page = pageContent[type];

  if (!page) {
    return (
      <>
        <Header />

        <main className="info-page">
          <section className="info-section">
            <span className="info-eyebrow">BESTXWORST</span>
            <h1>Page not found.</h1>
            <p>
              The information page you are looking for does not exist or may
              have moved.
            </p>

            <InfoInlineLink to="/">
              Return to homepage
            </InfoInlineLink>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const Icon = page.icon;

  return (
    <>
      <Header />

      <main className="info-page">
        <InfoHero
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.description}
          Icon={Icon}
        />

        {type === "about" && (
          <div className="info-content">
            <InfoSectionHeading
              eyebrow="WHY WE EXIST"
              title="Better decisions start with better information."
            >
              <p>
                Choosing a product, service, or piece of software can be
                confusing. Marketing claims, technical specifications, and
                conflicting opinions often make it difficult to understand
                what actually matters.
              </p>

              <p>
                BestXWorst aims to make that process clearer. We publish
                reviews, comparisons, buying guides, and practical explainers
                designed to help readers understand their options.
              </p>
            </InfoSectionHeading>

            <section className="info-feature-grid">
              <article className="info-feature">
                <Target size={27} strokeWidth={1.5} aria-hidden="true" />

                <h3>Reader-first decisions</h3>

                <p>
                  We focus on practical questions, meaningful differences,
                  limitations, and the needs of different readers.
                </p>
              </article>

              <article className="info-feature">
                <ShieldCheck
                  size={27}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <h3>Independent judgment</h3>

                <p>
                  Commercial relationships should not determine our editorial
                  conclusions or recommendations.
                </p>
              </article>

              <article className="info-feature">
                <ClipboardCheck
                  size={27}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <h3>Transparent evidence</h3>

                <p>
                  We aim to explain the basis for our conclusions and
                  distinguish direct testing from research-based analysis.
                </p>
              </article>
            </section>

            <section className="info-section info-section--bordered">
              <span className="info-eyebrow">OUR COVERAGE</span>

              <h2>Explore what matters to you.</h2>

              <p>
                Our coverage can include technology, AI and software, home
                and living, cars, beauty, fashion, travel, and practical
                how-to guides.
              </p>

              <InfoInlineLink to="/reviews/">
                Explore reviews
              </InfoInlineLink>
            </section>

            <section className="info-callout">
              <span>OUR PRINCIPLE</span>

              <h2>Evidence before opinion.</h2>

              <p>
                We want readers to understand not only our conclusions, but
                also the reasoning and limitations behind them.
              </p>
            </section>
          </div>
        )}

        {type === "standards" && (
          <div className="info-content">
            <InfoSectionHeading
              eyebrow="EDITORIAL INTEGRITY"
              title="Trust must be earned."
            >
              <p>
                Our editorial standards are intended to keep content useful,
                transparent, and accountable. Every published article should
                be written to inform readers rather than simply promote a
                product.
              </p>
            </InfoSectionHeading>

            <section className="info-policy-list">
              <article>
                <div className="info-policy-icon">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3>Accuracy and verification</h3>

                  <p>
                    We aim to verify important claims using relevant sources,
                    product documentation, reliable reporting, and other
                    available evidence. Information may be updated when
                    reliable new details emerge.
                  </p>
                </div>
              </article>

              <article>
                <div className="info-policy-icon">
                  <ShieldCheck size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3>Editorial independence</h3>

                  <p>
                    Advertisers, affiliate partners, and product providers
                    must not purchase positive verdicts or dictate our
                    conclusions. Payment does not guarantee a favorable
                    review or recommendation.
                  </p>
                </div>
              </article>

              <article>
                <div className="info-policy-icon">
                  <ClipboardCheck size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3>Honest testing claims</h3>

                  <p>
                    We will not claim that a product was physically tested
                    unless that testing actually took place. Research-based
                    assessments should be identified appropriately.
                  </p>
                </div>
              </article>

              <article>
                <div className="info-policy-icon">
                  <MessageSquare size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3>Corrections and updates</h3>

                  <p>
                    Readers can contact us about factual errors or outdated
                    information. We will review substantiated concerns and
                    make appropriate corrections when needed.
                  </p>
                </div>
              </article>

              <article>
                <div className="info-policy-icon">
                  <Mail size={22} aria-hidden="true" />
                </div>

                <div>
                  <h3>Commercial transparency</h3>

                  <p>
                    Where applicable, affiliate links, sponsored content,
                    and other commercial relationships should be disclosed
                    clearly so readers can understand the context.
                  </p>
                </div>
              </article>
            </section>

            <section className="info-section info-section--bordered">
              <span className="info-eyebrow">HAVE A CONCERN?</span>

              <h2>Help us improve.</h2>

              <p>
                If you spot a possible factual error or have a question about
                our editorial practices, send us a message.
              </p>

              <InfoInlineLink to="/contact/">
                Contact the editorial team
              </InfoInlineLink>
            </section>
          </div>
        )}

        {type === "testing" && (
          <div className="info-content">
            <InfoSectionHeading
              eyebrow="A CLEARER PROCESS"
              title="Understand the evidence behind a recommendation."
            >
              <p>
                Different products require different evaluation methods.
                The appropriate process depends on the product, the question
                being answered, and the evidence available.
              </p>

              <p>
                We aim to explain the basis of our conclusions instead of
                presenting every assessment as if it came from identical
                hands-on testing.
              </p>
            </InfoSectionHeading>

            <section className="info-steps">
              <article className="info-step">
                <span className="info-step__number">01</span>

                <div>
                  <h3>Define the reader's needs</h3>

                  <p>
                    Identify the intended use, important requirements, price
                    considerations, and the questions a reader needs answered.
                  </p>
                </div>
              </article>

              <article className="info-step">
                <span className="info-step__number">02</span>

                <div>
                  <h3>Gather relevant evidence</h3>

                  <p>
                    Depending on the article, evidence may include hands-on
                    testing, product specifications, official documentation,
                    verified information, and credible independent sources.
                  </p>
                </div>
              </article>

              <article className="info-step">
                <span className="info-step__number">03</span>

                <div>
                  <h3>Compare strengths and limitations</h3>

                  <p>
                    Consider usability, features, reliability, value,
                    trade-offs, and the situations in which an option may
                    or may not fit.
                  </p>
                </div>
              </article>

              <article className="info-step">
                <span className="info-step__number">04</span>

                <div>
                  <h3>Explain the conclusion</h3>

                  <p>
                    Present the main findings, who may benefit, important
                    drawbacks, and any limitations in the available evidence.
                  </p>
                </div>
              </article>

              <article className="info-step">
                <span className="info-step__number">05</span>

                <div>
                  <h3>Review when information changes</h3>

                  <p>
                    Prices, software, products, and availability can change.
                    Articles should be reviewed when meaningful new information
                    warrants an update.
                  </p>
                </div>
              </article>
            </section>

            <section className="info-callout">
              <span>IMPORTANT DISTINCTION</span>

              <h2>Research is not the same as hands-on testing.</h2>

              <p>
                We should accurately describe the evidence used for each
                assessment. If direct testing was not conducted, an article
                must not imply otherwise.
              </p>
            </section>
          </div>
        )}

        <section className="info-bottom-cta">
          <div>
            <span className="info-eyebrow">BESTXWORST</span>

            <h2>Make your next decision with more confidence.</h2>
          </div>

          <Link to="/reviews/" className="info-cta-button">
            Explore reviews <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

export function AboutPage() {
  return <InformationPage type="about" />;
}

export function EditorialStandardsPage() {
  return <InformationPage type="standards" />;
}

export function HowWeTestPage() {
  return <InformationPage type="testing" />;
}

export function ContactPage() {
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_DATA,
  }));

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setStatus({
      type: "",
      message: "",
    });

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({
        type: "error",
        message: "Please complete all required fields.",
      });
      return;
    }

    if (payload.name.length > 100) {
      setStatus({
        type: "error",
        message: "Your name must be 100 characters or fewer.",
      });
      return;
    }

    if (payload.email.length > 254) {
      setStatus({
        type: "error",
        message: "Please use a valid email address.",
      });
      return;
    }

    if (payload.message.length > 5000) {
      setStatus({
        type: "error",
        message: "Your message must be 5000 characters or fewer.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            `Unable to send your message. Server returned ${response.status}.`
        );
      }

      setStatus({
        type: "success",
        message:
          result.message || "Your message has been sent successfully.",
      });

      setFormData({
        ...INITIAL_FORM_DATA,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "We could not send your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="info-page contact-page">
        <InfoHero
          eyebrow="GET IN TOUCH"
          title="We'd like to hear from you."
          description="Have a question, spotted an error, or want to discuss an editorial matter? Send the team a message."
          Icon={Mail}
        />

        <div className="contact-layout">
          <section className="contact-intro">
            <span className="info-eyebrow">CONTACT BESTXWORST</span>

            <h2>Questions, corrections, and feedback.</h2>

            <p>
              Use the form to contact us about our content, editorial
              standards, corrections, or general enquiries.
            </p>

            <div className="contact-note">
              <Mail size={22} aria-hidden="true" />

              <div>
                <h3>Email us directly</h3>

                <p>
                  Prefer email? You can contact our team using the address
                  below.
                </p>

                <a
                  className="info-inline-link"
                  href={`mailto:${CONTACT_EMAIL}?subject=BestXWorst%20Enquiry`}
                >
                  {CONTACT_EMAIL} <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="contact-note">
              <MessageSquare size={22} aria-hidden="true" />

              <div>
                <h3>Help us understand your message</h3>

                <p>
                  Include the article title or URL when reporting an issue
                  with a particular page.
                </p>
              </div>
            </div>

            <div className="contact-note">
              <ShieldCheck size={22} aria-hidden="true" />

              <div>
                <h3>Editorial questions</h3>

                <p>
                  Questions about our methods or a possible factual error
                  are welcome.
                </p>
              </div>
            </div>
          </section>

          <section className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <label>
                  Your name <span aria-hidden="true">*</span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Email address <span aria-hidden="true">*</span>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label>
                Subject

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option>General enquiry</option>
                  <option>Correction or factual error</option>
                  <option>Editorial standards</option>
                  <option>Business enquiry</option>
                  <option>Technical issue</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Your message <span aria-hidden="true">*</span>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows={6}
                  maxLength={5000}
                  required
                />

                <small className="contact-character-count">
                  {formData.message.length}/5000 characters
                </small>
              </label>

              {status.message && (
                <p
                  className={`contact-status contact-status--${status.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </p>
              )}

              <button
                className="contact-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}

                {!isSubmitting && (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </button>

              <p className="contact-privacy-note">
                Please avoid including passwords, payment details, or other
                sensitive personal information.
              </p>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default InformationPage;
