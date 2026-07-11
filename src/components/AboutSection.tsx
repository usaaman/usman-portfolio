import { ScrollReveal } from './ScrollReveal'
import { SectionIntro } from './SectionIntro'

interface AboutSectionProps {
  id: string
  content: string
  highlights: { label: string }[]
}

export function AboutSection({ id, content, highlights }: AboutSectionProps) {
  return (
    <section id={id} className="px-4 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="About"
          title="Creative problem-solving with code, AI, and visuals."
          subtitle="A software engineering journey shaped by both technical depth and visual storytelling."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-10">
            <p className="text-lg leading-8 text-[color:color-mix(in_oklab,var(--color-text)_82%,transparent)]">
              {content}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Areas of Interest
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full border border-white/10 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-primary)_15%,transparent),color-mix(in_oklab,var(--color-accent)_12%,transparent))] px-4 py-2 text-sm font-medium text-[var(--color-text)]"
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:color-mix(in_oklab,var(--color-text)_60%,transparent)]">
                  Current Path
                </p>
                <p className="mt-2 font-display text-xl text-[var(--color-text)]">5th Semester</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:color-mix(in_oklab,var(--color-text)_60%,transparent)]">
                  Building With
                </p>
                <p className="mt-2 font-display text-xl text-[var(--color-text)]">React + Firebase</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
