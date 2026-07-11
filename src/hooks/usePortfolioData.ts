import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {
  applySiteTheme,
  firestoreHeroToHeroData,
  firestoreProjectsToProjectItems,
  firestoreServicesToServiceItems,
  getFallbackPortfolioData,
  skillsToCategories,
} from '../lib/dataTransform'
import { db } from '../lib/firebase'
import type {
  FirestoreAbout,
  FirestoreHeroContent,
  FirestoreProjectItem,
  FirestoreServiceItem,
  FirestoreSiteTheme,
  FirestoreSkillItem,
} from '../types/firestore'
import type { PortfolioData } from '../types'

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [isRealtime, setIsRealtime] = useState(true)

  useEffect(() => {
    let hero: FirestoreHeroContent | null = null
    let about: FirestoreAbout | null = null
    let skills: FirestoreSkillItem[] = []
    let projects: FirestoreProjectItem[] = []
    let services: FirestoreServiceItem[] = []
    let theme: FirestoreSiteTheme | null = null
    let gotFirstSnapshot = false

    const rebuild = () => {
      if (!hero || !about) {
        if (gotFirstSnapshot) {
          setData(getFallbackPortfolioData())
          setUsingFallback(true)
          setLoading(false)
        }
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
      setLoading(false)
    }

    const markReady = () => {
      if (!gotFirstSnapshot) {
        gotFirstSnapshot = true
      }
      rebuild()
    }

    const unsubs = [
      onSnapshot(
        doc(db, 'heroContent', 'main'),
        (snap) => {
          hero = snap.exists() ? (snap.data() as FirestoreHeroContent) : null
          markReady()
        },
        (err) => {
          console.error('heroContent listener error:', err)
          setError(err.message)
          setIsRealtime(false)
          markReady()
        },
      ),
      onSnapshot(
        doc(db, 'about', 'main'),
        (snap) => {
          about = snap.exists() ? (snap.data() as FirestoreAbout) : null
          markReady()
        },
        (err) => {
          console.error('about listener error:', err)
          setError(err.message)
          setIsRealtime(false)
          markReady()
        },
      ),
      onSnapshot(
        doc(db, 'skills', 'main'),
        (snap) => {
          const items = snap.exists() ? ((snap.data().items ?? []) as FirestoreSkillItem[]) : []
          skills = [...items].sort((a, b) => a.order - b.order)
          markReady()
        },
        (err) => {
          console.error('skills listener error:', err)
          markReady()
        },
      ),
      onSnapshot(
        doc(db, 'projects', 'main'),
        (snap) => {
          const items = snap.exists() ? ((snap.data().items ?? []) as FirestoreProjectItem[]) : []
          projects = [...items].sort((a, b) => a.order - b.order)
          markReady()
        },
        (err) => {
          console.error('projects listener error:', err)
          markReady()
        },
      ),
      onSnapshot(
        doc(db, 'services', 'main'),
        (snap) => {
          const items = snap.exists() ? ((snap.data().items ?? []) as FirestoreServiceItem[]) : []
          services = [...items].sort((a, b) => a.order - b.order)
          markReady()
        },
        (err) => {
          console.error('services listener error:', err)
          markReady()
        },
      ),
      onSnapshot(
        doc(db, 'siteTheme', 'main'),
        (snap) => {
          theme = snap.exists() ? (snap.data() as FirestoreSiteTheme) : null
          markReady()
        },
        (err) => {
          console.error('siteTheme listener error:', err)
          markReady()
        },
      ),
    ]

    return () => {
      unsubs.forEach((unsub) => unsub())
    }
  }, [])

  return { data, loading, error, usingFallback, isRealtime }
}
