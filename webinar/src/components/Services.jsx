function Services({ skills }) {
  return (
    <section className="services-section section-wrap" id="services">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> The things I do</p>
          <h2>
            Good ideas,<br />
            <em>well made.</em>
          </h2>
        </div>
        <p className="section-note">
          One thoughtful partner from first sketch<br />
          to final line of code.
        </p>
      </div>

      <div className="skill-grid">
        {skills.map(([title, ...items]) => (
          <div className="skill-card" key={title}>
            <p className="skill-index">{title}</p>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span className="skill-plus">↗</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
