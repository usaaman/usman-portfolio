import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ProjectItem } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ScrollReveal } from './ScrollReveal'
import { SectionIntro } from './SectionIntro'

interface ProjectsSectionProps {
  id: string
  projects: ProjectItem[]
  moreHref: string
  loading?: boolean
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  return (
    <ScrollReveal key={`${project.title}-${index}`} delay={index * 0.08}>
      <motion.article
        whileHover={{ y: -10, scale: 1.01 }}
        transition={{ duration: 0.25 }}
        className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_88%,transparent),color-mix(in_oklab,var(--color-surface)_68%,transparent))] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      >
        <div className="absolute inset-x-10 top-0 h-20 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_30%,transparent),transparent)] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 rounded-[2rem] border border-transparent bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_20%,transparent),color-mix(in_oklab,var(--color-accent)_12%,transparent))] opacity-0 transition group-hover:opacity-100" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
              {project.comingSoon ? 'Reserved' : 'Featured'}
            </span>
            {project.comingSoon ? (
              <span className="inline-flex items-center gap-2 text-sm text-[color:color-mix(in_oklab,var(--color-text)_68%,transparent)]">
                <Sparkles size={16} />
                Coming Soon
              </span>
            ) : (
              <div className="flex items-center gap-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    aria-label={`${project.title} GitHub repository`}
                  >
                    <Github size={18} />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/[0.06] p-2 text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    aria-label={`${project.title} live demo`}
                  >
                    <ExternalLink size={18} />
                  </a>
                ) : null}
              </div>
            )}
          </div>

          <h3 className="font-display text-2xl text-[var(--color-text)]">{project.title}</h3>
          <p className="mt-4 flex-1 text-base leading-7 text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)]">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </ScrollReveal>
  )
}

export function ProjectsSection({
  id,
  projects,
  moreHref,
  loading = false,
}: ProjectsSectionProps) {
  const [showMore, setShowMore] = useState(false)

  const { featuredProjects, moreProjects } = useMemo(() => {
    const featured = projects.filter((project) => project.featured).slice(0, 4)
    const more = projects.filter((project) => !project.featured)
    return { featuredProjects: featured, moreProjects: more }
  }, [projects])

  return (
    <section id={id} className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Projects"
          title="Featured builds with room for future admin-managed case studies."
          subtitle="Featured projects are managed from the admin panel. Up to four appear here; the rest live under See More."
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="min-h-[300px]" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
              ))}
            </div>

            {showMore && moreProjects.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {moreProjects.map((project, index) => (
                  <ProjectCard key={`more-${project.title}-${index}`} project={project} index={index} />
                ))}
              </div>
            ) : null}
          </AnimatePresence>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {moreProjects.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowMore((current) => !current)}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {showMore ? 'Show Less' : `See More (${moreProjects.length})`}
            </button>
          ) : null}
          <a
            href={moreHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
