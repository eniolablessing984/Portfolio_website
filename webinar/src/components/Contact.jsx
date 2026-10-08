import Arrow from './Arrow'

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner section-wrap">
        <p className="eyebrow"><span className="eyebrow-line" /> Have something in mind?</p>
        <h2>
          Let’s make it<br />
          <em>mean something.</em>
        </h2>
        <div className="contact-bottom">
          <p>
            Have a good one brewing? I’d love to hear about it.<br />
            Tell me where you want to go — we’ll figure out the how.
          </p>
          <a className="button button-light" href="mailto:hello@yourname.dev">
            Start a conversation <Arrow diagonal />
          </a>
        </div>
        <a className="contact-email" href="mailto:hello@yourname.dev">hello@yourname.dev</a>
      </div>
    </section>
  )
}

export default Contact
