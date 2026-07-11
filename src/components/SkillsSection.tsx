import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import type { SkillCategory } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'

interface SkillsSectionProps {
  id: string
  skills: SkillCategory[]
  loading?: boolean
}

export function SkillsSection({ id, skills, loading = false }: SkillsSectionProps) {
  const categories = useMemo(
    () =>
      skills.map((cat) => ({
        category: cat.label,
        items: cat.skills.map((skill) => ({
          name: skill.name,
          percentage: skill.level,
        })),
      })),
    [skills],
  )

  const [active, setActive] = useState(0)
  const current = categories[active]

  if (loading) {
    return (
      <section id={id} className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <LoadingSkeleton className="min-h-[420px]" />
        </div>
      </section>
    )
  }

  if (!current) return null

  return (
    <section id={id} className="relative px-6 py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 20% 40%, oklch(0.68 0.28 300 / 0.08), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Code2 className="h-4 w-4" style={{ color: 'var(--neon-purple)' }} />
            <span>Skills</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Tools of the <span className="text-gradient">trade</span>
          </h2>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                active === i
                  ? 'border-transparent text-primary-foreground'
                  : 'border-border bg-surface/60 text-muted-foreground hover:text-foreground'
              }`}
              style={active === i ? { background: 'var(--gradient-hero)' } : undefined}
            >
              {cat.category}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {current.items.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: 'var(--neon-cyan)' }}
                  >
                    {skill.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-input">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--gradient-accent)' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
