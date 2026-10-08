import Arrow from './Arrow'

function Hero() {
  return (
    <section className="hero page-grid" id="home">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> Digital design & development · London / Everywhere</p>
        <h1>
          Thoughtful digital<br />
          work for a <em>more</em><br />
          <em>human</em> internet.
        </h1>
        <p className="hero-lede">
          I’m Alex — an independent designer and developer partnering with good people to make useful things feel unforgettable.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#work">Explore selected work <Arrow /></a>
          <a className="text-link" href="#about">A little about me <Arrow diagonal /></a>
        </div>
      </div>

     

      <div className="hero-foot">
        <span>Scroll to explore</span>
        <span className="scroll-rule" />
        <span>Selected work · 2024—26</span>
      </div>
    </section>
  )
}

export default Hero
