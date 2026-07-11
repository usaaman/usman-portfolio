import { useRef, useState } from 'react'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import type { ProjectItem } from '../types'

interface ProjectCard3DProps {
  project: ProjectItem
}

export function ProjectCard3D({ project }: ProjectCard3DProps) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTransform({
      rotateX: y * -14,
      rotateY: x * 14,
      scale: 1.02,
    })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
      }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 shadow-[0_18px_45px_-25px_oklch(0.68_0.28_300/0.55)] backdrop-blur hover:shadow-[0_28px_60px_-20px_oklch(0.68_0.28_300/0.65)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {!project.comingSoon && project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="rounded-lg border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:border-primary hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          ) : null}
          {!project.comingSoon && project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} live demo`}
              className="rounded-lg border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:border-secondary hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative p-6">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-display text-xl font-bold md:text-2xl">{project.title}</h3>
          {project.comingSoon ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Coming Soon
            </span>
          ) : null}
        </div>
        <p className="mb-5 text-sm text-muted-foreground md:text-base">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 0%), oklch(0.68 0.28 300 / 0.12), transparent 55%)',
        }}
      />
    </article>
  )
}
