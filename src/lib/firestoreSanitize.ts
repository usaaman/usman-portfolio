import type {
  FirestoreAbout,
  FirestoreHeroContent,
  FirestoreProjectItem,
  FirestoreServiceItem,
  FirestoreSkillItem,
} from '../types/firestore'

/** Firestore rejects `undefined` field values — strip them before every write. */
export function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function sanitizeHeroContent(data: FirestoreHeroContent): FirestoreHeroContent {
  return {
    name: data.name ?? '',
    tagline: data.tagline ?? '',
    summary: data.summary ?? data.intro ?? '',
    resumeUrl: data.resumeUrl ?? '',
    profileImageUrl: data.profileImageUrl ?? '',
  }
}

export function sanitizeSkills(items: FirestoreSkillItem[]): FirestoreSkillItem[] {
  return items.map((item, index) => ({
    id: item.id ?? `skill-${index}`,
    category: item.category ?? '',
    name: item.name ?? '',
    percentage: Number(item.percentage) || 0,
    order: item.order ?? index,
  }))
}

export function sanitizeProjects(items: FirestoreProjectItem[]): FirestoreProjectItem[] {
  return items.map((item, index) => ({
    id: item.id ?? `project-${index}`,
    title: item.title ?? '',
    description: item.description ?? '',
    techStack: item.techStack ?? [],
    githubUrl: item.githubUrl ?? '',
    liveUrl: item.liveUrl ?? '',
    featured: item.featured ?? false,
    order: item.order ?? index,
    comingSoon: item.comingSoon ?? false,
    imageUrl: item.imageUrl ?? '',
  }))
}

export function sanitizeServices(items: FirestoreServiceItem[]): FirestoreServiceItem[] {
  return items.map((item, index) => ({
    id: item.id ?? `service-${index}`,
    title: item.title ?? '',
    description: item.description ?? '',
    category: item.category ?? '',
    iconName: item.iconName ?? 'Globe',
    badge: item.badge ?? '',
    order: item.order ?? index,
  }))
}

export function sanitizeAbout(data: FirestoreAbout): FirestoreAbout {
  return {
    bio: data.bio ?? '',
    highlights: (data.highlights ?? []).map((h) => ({ label: h.label ?? '' })),
  }
}

export function fileNameFromUrl(url: string): string {
  if (!url) return ''
  try {
    const pathname = new URL(url).pathname
    const segment = pathname.split('/').pop() ?? ''
    return decodeURIComponent(segment.split('?')[0])
  } catch {
    return url.split('/').pop()?.split('?')[0] ?? 'file'
  }
}
