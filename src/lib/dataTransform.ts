import { portfolioData } from '../data/portfolioData'
import type { HeroData, PortfolioData, ProjectItem, ServiceItem, SkillCategory } from '../types'
import type {
  FirestoreAbout,
  FirestoreHeroContent,
  FirestoreProjectItem,
  FirestoreServiceItem,
  FirestoreSiteTheme,
  FirestoreSkillItem,
} from '../types/firestore'
import { resolveServiceIcon } from '../lib/iconMap'

export const defaultSiteTheme: FirestoreSiteTheme = {
  primary: '#7cf6d4',
  secondary: '#7d7cff',
  accent: '#ff7bd5',
  bg: '#0b1020',
  surface: '#131a31',
  text: '#f5f7ff',
}

export function portfolioDataToFirestoreSeed() {
  const skills: FirestoreSkillItem[] = []
  let skillOrder = 0

  portfolioData.skills.forEach((category) => {
    category.skills.forEach((skill) => {
      skills.push({
        id: `skill-${skillOrder}`,
        category: category.label,
        name: skill.name,
        percentage: skill.level,
        order: skillOrder,
      })
      skillOrder += 1
    })
  })

  const projects: FirestoreProjectItem[] = portfolioData.projects.map((project, index) => ({
    id: `project-${index}`,
    title: project.title,
    description: project.description,
    techStack: project.tech,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured ?? false,
    order: index,
    comingSoon: project.comingSoon,
  }))

  const serviceIconNames = ['Globe', 'LayoutDashboard', 'Bot', 'CloudCog', 'Code2', 'Brush']
  const services: FirestoreServiceItem[] = portfolioData.services.map((service, index) => ({
    id: `service-${index}`,
    title: service.title,
    description: service.description,
    category: 'Freelance',
    iconName: serviceIconNames[index] ?? 'Globe',
    badge: service.badge,
    order: index,
  }))

  const hero: FirestoreHeroContent = {
    name: portfolioData.hero.name,
    tagline: portfolioData.hero.tagline,
    summary: portfolioData.hero.summary,
    profileImageUrl: portfolioData.hero.profileImageUrl,
    resumeUrl: portfolioData.hero.resumeUrl,
  }

  const about: FirestoreAbout = {
    bio: portfolioData.about,
    highlights: portfolioData.highlights,
  }

  return { hero, about, skills, projects, services, theme: defaultSiteTheme }
}

export function skillsToCategories(items: FirestoreSkillItem[]): SkillCategory[] {
  const categoryMap = new Map<string, SkillCategory>()

  items.forEach((item) => {
    const key = item.category
    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        id: key.toLowerCase().replace(/\s+/g, '-'),
        label: item.category,
        description: `${item.category} skills and tools.`,
        skills: [],
      })
    }
    categoryMap.get(key)!.skills.push({
      name: item.name,
      level: item.percentage,
    })
  })

  return Array.from(categoryMap.values())
}

export function firestoreHeroToHeroData(hero: FirestoreHeroContent): HeroData {
  return {
    name: hero.name,
    tagline: hero.tagline,
    summary: hero.summary ?? hero.intro ?? '',
    resumeUrl: hero.resumeUrl,
    profileImageUrl: hero.profileImageUrl,
  }
}

export function firestoreProjectsToProjectItems(projects: FirestoreProjectItem[]): ProjectItem[] {
  return projects.map((p) => ({
    title: p.title,
    description: p.description,
    tech: p.techStack,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    featured: p.featured,
    comingSoon: p.comingSoon,
  }))
}

export function firestoreServicesToServiceItems(services: FirestoreServiceItem[]): ServiceItem[] {
  return services.map((s) => ({
    title: s.title,
    description: s.description,
    icon: resolveServiceIcon(s.iconName),
    badge: s.badge,
  }))
}

export function applySiteTheme(theme: FirestoreSiteTheme) {
  const root = document.documentElement
  root.style.setProperty('--primary', theme.primary)
  root.style.setProperty('--secondary', theme.secondary)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--background', theme.bg)
  root.style.setProperty('--surface', theme.surface)
  root.style.setProperty('--foreground', theme.text)
  root.style.setProperty('--neon-purple', theme.primary)
  root.style.setProperty('--neon-cyan', theme.secondary)
  root.style.setProperty('--neon-coral', theme.accent)
  root.style.setProperty(
    '--gradient-hero',
    `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%)`,
  )
  root.style.setProperty('--gradient-accent', `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`)
  root.style.setProperty('--gradient-coral', `linear-gradient(90deg, ${theme.accent}, ${theme.primary})`)
}

export function getFallbackPortfolioData(): PortfolioData {
  return portfolioData
}
