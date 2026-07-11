import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { SkillCategory } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ScrollReveal } from './ScrollReveal'
import { SectionIntro } from './SectionIntro'

interface SkillsSectionProps {
  id: string
  skills: SkillCategory[]
  loading?: boolean
}

export function SkillsSection({ id, skills, loading = false }: SkillsSectionProps) {
  const defaultTab = useMemo(() => skills[0]?.id ?? '', [skills])
  const [activeTab, setActiveTab] = useState(defaultTab)
  const activeCategory = skills.find((category) => category.id === activeTab) ?? skills[0]

  useEffect(() => {
    if (defaultTab && !activeTab) {
      setActiveTab(defaultTab)
    }
  }, [activeTab, defaultTab])

  return (
    <section id={id} className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Skills"
          title="Flexible across frontend, backend, AI, and creative production."
          subtitle="The section is already structured as prop-driven categories so it can plug into an admin-managed CMS later."
        />

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <LoadingSkeleton className="min-h-[420px]" />
            <LoadingSkeleton className="min-h-[420px]" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <ScrollReveal className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-5">
              <div className="grid gap-3">
                {skills.map((category) => {
                  const selected = category.id === activeCategory?.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveTab(category.id)}
                      className={clsx(
                        'group rounded-[1.5rem] border px-5 py-4 text-left transition',
                        selected
                          ? 'border-[color:color-mix(in_oklab,var(--color-primary)_55%,transparent)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_20%,transparent),color-mix(in_oklab,var(--color-accent)_18%,transparent))] shadow-[0_0_30px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]'
                          : 'border-white/10 bg-black/[0.08] hover:border-white/20 hover:bg-white/[0.08]',
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl text-[var(--color-text)]">{category.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-[color:color-mix(in_oklab,var(--color-text)_68%,transparent)]">
                            {category.description}
                          </p>
                        </div>
                        <ChevronDown
                          className={clsx(
                            'shrink-0 transition',
                            selected ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-text)]',
                          )}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
              <AnimatePresence mode="wait">
                {activeCategory ? (
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-8">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                        {activeCategory.label}
                      </p>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)]">
                        {activeCategory.description}
                      </p>
                    </div>

                    <div className="grid gap-5">
                      {activeCategory.skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: index * 0.06 }}
                        >
                          <div className="mb-2 flex items-center justify-between text-sm font-medium text-[var(--color-text)]">
                            <span>{skill.name}</span>
                            <span className="text-[var(--color-primary)]">{skill.level}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-black/[0.18]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-secondary),var(--color-accent))] shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  )
}
