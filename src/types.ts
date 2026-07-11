import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type ThemeMode = 'dark' | 'light'

export interface NavItem {
  id: string
  label: string
}

export interface HeroData {
  name: string
  tagline: string
  summary: string
  resumeUrl: string
  profileImageUrl?: string
}

export interface HighlightBadge {
  label: string
}

export interface SkillItem {
  name: string
  level: number
}

export interface SkillCategory {
  id: string
  label: string
  description: string
  skills: SkillItem[]
}

export interface ProjectItem {
  title: string
  description: string
  tech: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl: string
  featured?: boolean
  comingSoon?: boolean
}

export interface ServiceItem {
  title: string
  description: string
  icon: LucideIcon
  badge?: string
}

export interface ContactLinkItem {
  label: string
  value: string
  href: string
  icon: LucideIcon
}

export interface ContactFormValues {
  name: string
  email: string
  message: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PortfolioData {
  hero: HeroData
  about: string
  highlights: HighlightBadge[]
  skills: SkillCategory[]
  projects: ProjectItem[]
  services: ServiceItem[]
  contactLinks: ContactLinkItem[]
  extraProjectsHref: string
}

export interface SectionProps<T = undefined> {
  id: string
  title: string
  eyebrow: string
  subtitle: string
  loading?: boolean
  data?: T
  children?: ReactNode
}
