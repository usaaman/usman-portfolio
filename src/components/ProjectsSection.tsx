import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Rocket } from 'lucide-react'
import type { ProjectItem } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ProjectCard3D } from './ProjectCard3D'

interface ProjectsSectionProps {
  id: string
  projects: ProjectItem[]
  moreHref: string
  loading?: boolean
}

export function ProjectsSection({
  id,
  projects,
  moreHref,
  loading = false,
}: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const { featured, rest } = useMemo(() => {
    const featuredProjects = projects.filter((p) => p.featured)
    const moreProjects = projects.filter((p) => !p.featured)
    return { featured: featuredProjects, rest: moreProjects }
  }, [projects])

  const visible = showAll ? projects : featured.slice(0, 4)

  if (loading) {
    return (
      <section id={id} className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="min-h-[300px]" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id={id} className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Rocket className="h-4 w-4" style={{ color: 'var(--neon-coral)' }} />
            <span>Projects</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Recent <span className="text-gradient">work</span>
          </h2>
        </motion.div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Projects coming soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {visible.map((project, i) => (
              <motion.div
                key={`${project.title}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProjectCard3D project={project} />
              </motion.div>
            ))}

            {visible.length < 4 && !showAll ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-6 text-center text-muted-foreground"
              >
                <Plus className="mb-2 h-6 w-6" />
                <p className="text-sm">More projects on the way</p>
              </motion.div>
            ) : null}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {rest.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-surface-elevated"
            >
              {showAll ? 'Show less' : `See more (${rest.length})`}
            </button>
          ) : null}
          <a
            href={moreHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-surface-elevated"
          >
            View GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
