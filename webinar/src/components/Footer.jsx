import Arrow from './Arrow'

function Footer() {
  return (
    <footer className="footer">
      <a className="footer-brand" href="#home">a.</a>
      <p>Independent by choice. Curious by nature.</p>
      <div>
        <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noreferrer">
          LinkedIn <Arrow diagonal />
        </a>
        <a href="https://github.com/yourusername" target="_blank" rel="noreferrer">
          GitHub <Arrow diagonal />
        </a>
        <span>© Alex Stone 2026</span>
      </div>
    </footer>
  )
}

export default Footer
