import { motion } from 'framer-motion'
import type { ServiceItem } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ScrollReveal } from './ScrollReveal'
import { SectionIntro } from './SectionIntro'

interface ServicesSectionProps {
  id: string
  services: ServiceItem[]
  loading?: boolean
}

export function ServicesSection({ id, services, loading = false }: ServicesSectionProps) {
  return (
    <section id={id} className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Services"
          title="Freelance-ready services spanning development, AI, and creative delivery."
          subtitle="Built as a data-driven service grid so the admin panel can swap, add, or reorder offerings later."
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="min-h-[250px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <ScrollReveal key={service.title} delay={index * 0.07}>
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_86%,transparent),color-mix(in_oklab,var(--color-surface)_70%,transparent))] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_18%,transparent),color-mix(in_oklab,var(--color-accent)_14%,transparent))] opacity-0 transition duration-300 group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/10 text-[var(--color-primary)]">
                          <Icon size={24} />
                        </span>
                        {service.badge ? (
                          <span className="rounded-full border border-[color:color-mix(in_oklab,var(--color-primary)_50%,transparent)] bg-[color:color-mix(in_oklab,var(--color-primary)_12%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                            {service.badge}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-6 font-display text-2xl text-[var(--color-text)]">{service.title}</h3>
                      <p className="mt-4 text-base leading-7 text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)]">
                        {service.description}
                      </p>
                    </div>
                  </motion.article>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
