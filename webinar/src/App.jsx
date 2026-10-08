import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Services from './components/Services'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'
import PetalVortex from './components/originkit/ui/petal-vortex'

const navItems = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Services', '#services'],
  ['Contact', '#contact'],
]

const projects = [
  { number: '01', title: 'Luma Commerce', type: 'E-commerce · 2025', intro: 'A calmer way to shop for the things that make a house feel like home.', tags: ['Art direction', 'E-commerce', 'React'], color: 'luma', mark: 'luma', detail: 'A complete storefront rethink built around confident product discovery, a more considered mobile experience, and a checkout that gets out of the way.' },
  { number: '02', title: 'Northstar', type: 'Product design · 2024', intro: 'From scattered metrics to a clear view of what moves the business forward.', tags: ['SaaS', 'Data design', 'Design system'], color: 'north', mark: 'N°', detail: 'An analytics workspace designed to make complex signals legible. Clear hierarchy, useful defaults, and faster paths from insight to action.' },
  { number: '03', title: 'Studio Bloom', type: 'Brand & digital · 2024', intro: 'A new digital home for an independent creative studio with room to grow.', tags: ['Brand', 'Editorial', 'Next.js'], color: 'bloom', mark: 'bloom', detail: 'A flexible, image-led identity and portfolio experience that gives the studio’s work the space it deserves and turns curiosity into conversations.' },
]

const skills = [
  ['01 / Design', 'Art direction', 'Interface design', 'Prototyping', 'Design systems'],
  ['02 / Build', 'React & Next.js', 'TypeScript', 'Creative frontend', 'CMS integration'],
  ['03 / Thinking', 'Product strategy', 'Accessibility', 'Performance', 'Collaboration'],
]

const experience = [
  ['2024 — Now', 'Senior Frontend Developer', 'Independent · London'],
  ['2022 — 2024', 'Product Designer & Developer', 'Fieldwork Studio'],
  ['2019 — 2022', 'Web Developer', 'Goodside Digital'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme) return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <div className={`site-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {theme === 'dark' && (
        <div className="petal-vortex-bg" aria-hidden="true">
          <PetalVortex
            core="#7df9d4"
            tip="#9fb4ff"
            petals={18}
            lines={16}
            twist={10}
            wave={8}
            node={12}
            speed={18}
            spin={18}
            scale={90}
          />
        </div>
      )}

      <Header
        navItems={navItems}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
        setTheme={setTheme}
      />

      <main>
        <Hero />
        <Projects projects={projects} setSelected={setSelected} />
        <About />
        <Services skills={skills} />
        <Experience experience={experience} />
        <Contact />
      </main>

      <Footer />

      {selected && <ProjectModal selected={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default App
