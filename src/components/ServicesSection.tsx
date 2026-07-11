import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import type { ServiceItem } from '../types'
import { LoadingSkeleton } from './LoadingSkeleton'

interface ServicesSectionProps {
  id: string
  services: ServiceItem[]
  loading?: boolean
}

export function ServicesSection({ id, services, loading = false }: ServicesSectionProps) {
  if (loading) {
    return (
      <section id={id} className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="min-h-[250px]" />
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
            <Briefcase className="h-4 w-4" style={{ color: 'var(--neon-cyan)' }} />
            <span>Services</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Hire me on <span className="text-gradient">Fiverr & Upwork</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon
            const highlight = Boolean(service.badge)
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur"
                style={
                  highlight
                    ? {
                        borderColor: 'transparent',
                        background:
                          'linear-gradient(var(--surface), var(--surface)) padding-box, var(--gradient-coral) border-box',
                      }
                    : undefined
                }
              >
                {service.badge ? (
                  <span
                    className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      background: 'var(--gradient-coral)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {service.badge}
                  </span>
                ) : null}
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: highlight ? 'var(--gradient-coral)' : 'var(--gradient-accent)',
                  }}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
