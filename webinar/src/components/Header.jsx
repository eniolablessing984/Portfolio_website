function Header({ navItems, menuOpen, setMenuOpen, theme, setTheme }) {
  return (
    <header className="topbar">
      <a className="wordmark" href="#home" aria-label="Alex Stone, home">
        <span className="wordmark-icon">a.</span>
        <span>
          Alex Stone
          <small>Independent designer & developer</small>
        </span>
      </a>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        {menuOpen ? 'Close' : 'Menu'} <span>{menuOpen ? '−' : '+'}</span>
      </button>

      <nav className={menuOpen ? 'navigation is-open' : 'navigation'}>
        {navItems.map(([label, href]) => (
          <a key={label} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <a className="nav-availability" href="mailto:hello@yourname.dev">
          <i /> Available for work
        </a>
      </nav>
    </header>
  )
}

export default Header
