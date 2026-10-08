import Arrow from './Arrow'

function ProjectModal({ selected, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        <div className={`modal-art ${selected.color}`}>
          <span>{selected.mark}</span>
        </div>
        <p className="project-type">{selected.type}</p>
        <h2 id="modal-title">{selected.title}</h2>
        <p>{selected.detail}</p>
        <div className="tag-list">
          {selected.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a className="text-link" href="mailto:hello@yourname.dev?subject=Project%20enquiry">
          Discuss a similar project <Arrow diagonal />
        </a>
      </section>
    </div>
  )
}

export default ProjectModal
