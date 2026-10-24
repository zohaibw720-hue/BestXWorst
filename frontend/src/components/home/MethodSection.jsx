
function MethodSection() {
  const principles = [
    {
      number: "01",
      title: "Look beyond the badge.",
      description:
        "A famous name is only the beginning. We focus on the product itself.",
    },
    {
      number: "02",
      title: "Compare what matters.",
      description:
        "Design, usability, performance, ownership, and meaningful trade-offs.",
    },
    {
      number: "03",
      title: "Make the verdict clear.",
      description:
        "Understand the strengths, weaknesses, and reasons behind the verdict.",
    },
  ];

  return (
    <section className="method-section" id="method">
      <div className="method-top">
        <div>
          <div className="eyebrow">
            <span className="red-dot" />
            OUR APPROACH
          </div>

          <h2>
            Clarity over
            <br />
            <span>conventional wisdom.</span>
          </h2>
        </div>

        <p>
          A good review doesn't tell you what to think. It gives you
          the information to make up your own mind.
        </p>
      </div>

      <div className="principles-grid">
        {principles.map((principle) => (
          <div className="principle-card" key={principle.number}>
            <span className="principle-number">{principle.number}</span>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MethodSection;
