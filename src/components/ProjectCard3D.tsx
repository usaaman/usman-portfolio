import { useRef, useState } from 'react'
import { ExternalLink, Github, Sparkles } from 'lucide-react'
import type { ProjectItem } from '../types'

interface ProjectCard3DProps {
  project: ProjectItem
}

export function ProjectCard3D({ project }: ProjectCard3DProps) {
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = thumbRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTransform({
      rotateX: y * -18,
      rotateY: x * 20,
      scale: 1.03,
    })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 shadow-[0_18px_45px_-25px_oklch(0.68_0.28_300/0.55)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_28px_60px_-20px_oklch(0.68_0.28_300/0.65)]">
      <div className="flex justify-center pt-3">
        <div
          ref={thumbRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(900px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
            transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
            aspectRatio: '16 / 9',
          }}
className="relative w-[95%] overflow-hidden rounded-xl border border-border/60 shadow-lg"        >
          <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background: 'radial-gradient(circle at 50% 30%, oklch(0.68 0.28 300 / 0.18), transparent 60%)',
            }}
          />
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

        <div className="mb-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {!project.comingSoon && project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/70 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-foreground hover:scale-[1.03]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          ) : null}

          {!project.comingSoon && project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} live demo`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border/60 bg-background/70 px-4 py-2.5 text-sm font-medium text-muted-foreground backdrop-blur transition-all duration-200 hover:border-secondary hover:bg-secondary/10 hover:text-foreground hover:scale-[1.03]"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}