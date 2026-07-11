import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface AboutSectionProps {
  id: string
  content: string
  highlights: { label: string }[]
}

export function AboutSection({ id, content, highlights }: AboutSectionProps) {
  return (
    <section id={id} className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Sparkles className="h-4 w-4" style={{ color: 'var(--neon-cyan)' }} />
            <span>About Me</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Curious mind, <span className="text-gradient">creative hands</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          {content}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {highlights.map((item, i) => (
            <motion.span
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-primary/50"
            >
              {item.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
