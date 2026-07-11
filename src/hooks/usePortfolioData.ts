import { useEffect, useState } from 'react'
import {
  applySiteTheme,
  firestoreHeroToHeroData,
  firestoreProjectsToProjectItems,
  firestoreServicesToServiceItems,
  getFallbackPortfolioData,
  skillsToCategories,
} from '../lib/dataTransform'
import {
  fetchAbout,
  fetchHeroContent,
  fetchProjects,
  fetchServices,
  fetchSiteTheme,
  fetchSkills,
} from '../services/firestore'
import type { PortfolioData } from '../types'

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [hero, about, skills, projects, services, theme] = await Promise.all([
          fetchHeroContent(),
          fetchAbout(),
          fetchSkills(),
          fetchProjects(),
          fetchServices(),
          fetchSiteTheme(),
        ])

        if (cancelled) return

        if (!hero || !about) {
          setData(getFallbackPortfolioData())
          setUsingFallback(true)
          setLoading(false)
          return
        }

        if (theme) {
          applySiteTheme(theme)
        }

        setData({
          hero: firestoreHeroToHeroData(hero),
          about: about.bio,
          highlights: about.highlights ?? [],
          skills: skills.length > 0 ? skillsToCategories(skills) : getFallbackPortfolioData().skills,
          projects:
            projects.length > 0
              ? firestoreProjectsToProjectItems(projects)
              : getFallbackPortfolioData().projects,
          services:
            services.length > 0
              ? firestoreServicesToServiceItems(services)
              : getFallbackPortfolioData().services,
          contactLinks: getFallbackPortfolioData().contactLinks,
          extraProjectsHref: getFallbackPortfolioData().extraProjectsHref,
        })
        setUsingFallback(false)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load portfolio data')
          setData(getFallbackPortfolioData())
          setUsingFallback(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error, usingFallback }
}
