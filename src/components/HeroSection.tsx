import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDownRight, Download, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { HeroData } from '../types'
import { SmokyCursor } from './SmokyCursor'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  id: string
  data: HeroData
}

export function HeroSection({ id, data }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.parallax-orb').forEach((orb, index) => {
        gsap.to(orb, {
          yPercent: (index + 1) * -12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-20 pt-28 md:pb-28 md:pt-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="parallax-orb absolute left-[-8rem] top-[8rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--color-primary),transparent_70%)] opacity-30 blur-3xl" />
        <div className="parallax-orb absolute right-[-7rem] top-[15rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--color-accent),transparent_70%)] opacity-30 blur-3xl" />
        <div className="parallax-orb absolute bottom-[-5rem] left-[25%] h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--color-secondary),transparent_70%)] opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_92%,transparent),color-mix(in_oklab,var(--color-surface)_72%,transparent))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10">
          <SmokyCursor containerSelector={`#${id}`} />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
              <Sparkles size={14} />
              Software Engineer In Motion
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:color-mix(in_oklab,var(--color-text)_65%,transparent)]">
              {data.tagline}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-[var(--color-text)] md:text-7xl">
              {data.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:color-mix(in_oklab,var(--color-text)_76%,transparent)] md:text-lg">
              {data.summary}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_color-mix(in_oklab,var(--color-primary)_50%,transparent)] transition hover:-translate-y-1"
              >
                View My Work
                <ArrowDownRight size={18} />
              </a>
              <a
                href={data.resumeUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Download Resume
                <Download size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--color-primary)_50%,transparent),transparent_68%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_88%,transparent),color-mix(in_oklab,var(--color-surface)_64%,transparent))] p-6 shadow-[0_35px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="absolute inset-x-8 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-accent)_35%,transparent),transparent)] blur-2xl" />
            <img
              src={data.profileImageUrl}
              alt={`${data.name} portrait placeholder`}
              className="relative z-10 aspect-square w-full rounded-[1.75rem] object-cover shadow-[0_25px_80px_rgba(0,0,0,0.24)] ring-1 ring-white/10"
            />
            <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:color-mix(in_oklab,var(--color-text)_60%,transparent)]">
                  Focus
                </p>
                <p className="mt-2 font-display text-lg text-[var(--color-text)]">AI + Web</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:color-mix(in_oklab,var(--color-text)_60%,transparent)]">
                  Creative
                </p>
                <p className="mt-2 font-display text-lg text-[var(--color-text)]">Video Editing</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
