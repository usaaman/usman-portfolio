import { useMemo } from 'react'
import { AboutSection } from '../components/AboutSection'
import { ChatWidget } from '../components/ChatWidget'
import { ContactSection } from '../components/ContactSection'
import { FloatingNav } from '../components/FloatingNav'
import { HeroSection } from '../components/HeroSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { ServicesSection } from '../components/ServicesSection'
import { SkillsSection } from '../components/SkillsSection'
import { ThemeToggle } from '../components/ThemeToggle'
import { useActiveSection } from '../hooks/useActiveSection'
import { usePageView } from '../hooks/usePageView'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { useThemeMode } from '../hooks/useThemeMode'
import { submitContactForm } from '../services/api'
import type { ContactFormValues } from '../types'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

function PortfolioApp() {
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const { theme, toggleTheme } = useThemeMode()
  const { data, loading } = usePortfolioData()

  usePageView()

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <p>Loading portfolio...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_15%,transparent),transparent_38%),radial-gradient(circle_at_80%_15%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_28%),linear-gradient(180deg,var(--color-bg),color-mix(in_oklab,var(--color-bg)_88%,black))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,var(--color-text)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-text)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <FloatingNav items={navItems} activeSection={activeSection} />

      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <ChatWidget />

      <main>
        <HeroSection id="home" data={data.hero} />
        <AboutSection id="about" content={data.about} highlights={data.highlights} />
        <SkillsSection id="skills" skills={data.skills} loading={loading} />
        <ProjectsSection
          id="projects"
          projects={data.projects}
          moreHref={data.extraProjectsHref}
          loading={loading}
        />
        <ServicesSection id="services" services={data.services} loading={loading} />
        <ContactSection
          id="contact"
          links={data.contactLinks}
          onSubmit={async (values: ContactFormValues) => {
            await submitContactForm(values)
          }}
        />
      </main>

      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-5 text-center text-sm text-[color:color-mix(in_oklab,var(--color-text)_65%,transparent)] backdrop-blur-xl">
          © {new Date().getFullYear()} Muhammad Usman. Built with React, Firebase, and AI.
        </div>
      </footer>
    </div>
  )
}

export default PortfolioApp
