import Arrow from './Arrow'

function Projects({ projects, setSelected }) {
  return (
    <section className="work-section section-wrap" id="work">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> A few things I’ve made</p>
          <h2>
            Selected <em>work</em>
          </h2>
        </div>
        <p className="section-note">
          A mix of collaborations, experiments<br />
          and ideas brought to life.
        </p>
      </div>

      <div className="project-list">
        {projects.map((project) => (
          <article className="project" key={project.number}>
            <button
              className={`project-visual ${project.color}`}
              onClick={() => setSelected(project)}
              aria-label={`View ${project.title} project details`}
            >
              <span className="project-number">{project.number} / 03</span>
              <span className="project-mark">{project.mark}</span>
              <span className="project-sticker">
                {project.number === '01'
                  ? 'GOOD THINGS\nTAKE SHAPE'
                  : project.number === '02'
                    ? 'FIND YOUR\nTRUE NORTH'
                    : 'MADE WITH\nINTENTION'}
              </span>
              <span className="visual-arrow"><Arrow diagonal /></span>
            </button>

            <div className="project-info">
              <div>
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="project-intro">{project.intro}</p>
              </div>

              <div className="project-meta">
                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <button className="detail-link" onClick={() => setSelected(project)}>
                  View project <Arrow diagonal />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <a className="all-work-link" href="mailto:hello@yourname.dev?subject=More%20work">
        Ask me about more work <Arrow diagonal />
      </a>
    </section>
  )
}

export default Projects
