import { useMemo } from 'react'
import { AboutSection } from '../components/AboutSection'
import { ChatWidget } from '../components/ChatWidget'
import { ContactSection } from '../components/ContactSection'
import { FloatingNav } from '../components/FloatingNav'
import { FooterSection } from '../components/FooterSection'
import { HeroSection } from '../components/HeroSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { ServicesSection } from '../components/ServicesSection'
import { SkillsSection } from '../components/SkillsSection'
import { SmokyCursor } from '../components/SmokyCursor'
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
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p>Loading portfolio...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <SmokyCursor />
      <div className="relative z-10">
        <FloatingNav
          items={navItems}
          activeSection={activeSection}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
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
        <FooterSection />
        <ChatWidget />
      </div>
    </div>
  )
}

export default PortfolioApp
