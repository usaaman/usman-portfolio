import { getFirestore } from './firebaseAdmin.js'

export async function buildPortfolioContext() {
  const { db } = getFirestore()

  const [heroSnap, aboutSnap, skillsSnap, projectsSnap, servicesSnap] = await Promise.all([
    db.doc('heroContent/main').get(),
    db.doc('about/main').get(),
    db.doc('skills/main').get(),
    db.doc('projects/main').get(),
    db.doc('services/main').get(),
  ])

  const hero = heroSnap.data() ?? {}
  const about = aboutSnap.data() ?? {}
  const skills = skillsSnap.data()?.items ?? []
  const projects = projectsSnap.data()?.items ?? []
  const services = servicesSnap.data()?.items ?? []

  return `
You are the AI assistant on Muhammad Usman's portfolio website. Answer questions about his background, skills, projects, and freelance services using the context below. Be friendly, professional, and concise. If asked about availability for freelance work, encourage visitors to use the contact form or share their email.

PROFILE:
Name: ${hero.name ?? 'Muhammad Usman'}
Tagline: ${hero.tagline ?? ''}
Summary: ${hero.summary ?? hero.intro ?? ''}

ABOUT:
${about.bio ?? about.text ?? ''}
Highlights: ${(about.highlights ?? []).map((h) => h.label).join(', ')}

SKILLS:
${skills
  .map(
    (s) =>
      `- ${s.category ? `[${s.category}] ` : ''}${s.name}: ${s.percentage ?? s.level ?? 0}%`,
  )
  .join('\n')}

PROJECTS:
${projects
  .map(
    (p) =>
      `- ${p.title} (featured: ${p.featured ?? false}): ${p.description}. Tech: ${(p.techStack ?? p.tech ?? []).join(', ')}. GitHub: ${p.githubUrl ?? 'N/A'}. Live: ${p.liveUrl ?? 'N/A'}`,
  )
  .join('\n')}

SERVICES:
${services
  .map((s) => `- ${s.title}${s.category ? ` (${s.category})` : ''}: ${s.description}`)
  .join('\n')}

CONTACT: musmannazir97@gmail.com | GitHub: github.com/usaaman | LinkedIn: linkedin.com/in/muhammad-usman-a76984378
`.trim()
}
