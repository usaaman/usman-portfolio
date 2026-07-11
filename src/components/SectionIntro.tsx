import { ScrollReveal } from './ScrollReveal'

interface SectionIntroProps {
  eyebrow: string
  title: string
  subtitle: string
}

export function SectionIntro({ eyebrow, title, subtitle }: SectionIntroProps) {
  return (
    <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-primary)]">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)] md:text-lg">
        {subtitle}
      </p>
    </ScrollReveal>
  )
}
