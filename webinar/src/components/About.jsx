import Arrow from './Arrow'

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-inner section-wrap">
        <div className="about-aside">
          <p className="eyebrow"><span className="eyebrow-line" /> A little about me</p>
          <div className="about-seal">
            <span>CURIOUS BY NATURE</span>
            <b>a.</b>
            <span>MADE WITH INTENTION</span>
          </div>
        </div>

        <div className="about-copy">
          <h2>
            Good work starts with <em>paying attention.</em>
          </h2>
          <p className="about-lede">
            I’m a designer who codes, and a developer who cares about the details. I bring the big picture into focus, then sweat the small stuff that makes an experience feel just right.
          </p>
          <p>
            I work across the whole process — from the first messy conversation to the final, tiny interaction. Thoughtful by default, collaborative by nature, and always looking for the simple idea hiding inside a complicated problem.
          </p>
          <a className="text-link" href="/portfolio-cv.txt" download>
            More about my experience <Arrow diagonal />
          </a>

          <div className="stats">
            <div>
              <b>06<span>+</span></b>
              <small>Years in the making</small>
            </div>
            <div>
              <b>32</b>
              <small>Projects out in the world</small>
            </div>
            <div>
              <b>∞</b>
              <small>Tabs open right now</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
