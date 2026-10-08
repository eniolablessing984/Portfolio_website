import Arrow from './Arrow'

function Experience({ experience }) {
  return (
    <section className="experience-section section-wrap" id="experience">
      <div className="experience-title">
        <p className="eyebrow"><span className="eyebrow-line" /> The long and short of it</p>
        <h2>
          Built over<br />
          <em>time.</em>
        </h2>
      </div>

      <div className="experience-list">
        {experience.map(([date, role, company]) => (
          <div className="experience-row" key={date}>
            <span>{date}</span>
            <div>
              <h3>{role}</h3>
              <p>{company}</p>
            </div>
            <Arrow diagonal />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
