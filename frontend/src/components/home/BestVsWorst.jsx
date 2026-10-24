
import { ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

function BestVsWorst() {
  return (
    <section className="verdict-section">
      <div className="verdict-intro">
        <div className="eyebrow">
          <span className="red-dot" />
          THE BXW DIFFERENCE
        </div>

        <h2>
          Look past the badge.
          <br />
          Know what matters.
        </h2>

        <p>
          We look beyond the marketing, weigh the details, and focus
          on what actually makes a difference.
        </p>

        <a className="text-link" href="#method">
          OUR REVIEW PHILOSOPHY <ArrowRight size={16} />
        </a>
      </div>

      <div className="verdict-column verdict-best">
        <div className="verdict-symbol">
          <Check size={22} />
        </div>

        <span className="verdict-label">WORTH YOUR ATTENTION</span>
        <h3>The Best.</h3>

        <p>
          Standout quality, thoughtful design, performance, and
          genuine value.
        </p>

        <span className="verdict-index">01 / THE SHORTLIST</span>

        <Link className="text-link" to="/best/">
          EXPLORE BEST PICKS <ArrowRight size={15} />
        </Link>
      </div>

      <div className="verdict-column verdict-worst">
        <div className="verdict-symbol">
          <X size={22} />
        </div>

        <span className="verdict-label">THINK TWICE</span>
        <h3>The Worst.</h3>

        <p>
          Overpriced promises, avoidable compromises, and details
          worth knowing before you choose.
        </p>

        <span className="verdict-index">02 / THE RED FLAGS</span>

        <Link className="text-link" to="/worst/">
          KNOW WHAT TO AVOID <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

export default BestVsWorst;
