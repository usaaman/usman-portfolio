import { motion } from 'framer-motion'
import {
  ArrowDown,
  Atom,
  Box,
  Clapperboard,
  Download,
  Figma,
  Flame,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from 'lucide-react'
import type { HeroData } from '../types'

interface HeroSectionProps {
  id: string
  data: HeroData
}

export function HeroSection({ id, data }: HeroSectionProps) {
  const profileImage = data.profileImageUrl || '/usman-hero.jpg'
  const nameParts = data.name.trim().split(/\s+/)
  const firstName = nameParts[0] ?? data.name
  const lastName = nameParts.slice(1).join(' ')

  // Badges data with colors and icons (logos instead of text)
  const badges = [
    { name: 'React', icon: Atom, color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.3)' },
    { name: 'AI', icon: Sparkles, color: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.3)' },
    { name: 'Firebase', icon: Flame, color: '#FFA000', glow: 'rgba(255, 160, 0, 0.3)' },
    { name: 'Figma', icon: Figma, color: '#A259FF', glow: 'rgba(162, 89, 255, 0.3)' },
    { name: 'Unity', icon: Box, color: '#808080', glow: 'rgba(128, 128, 128, 0.3)' },
    { name: 'CapCut', icon: Clapperboard, color: '#00D4FF', glow: 'rgba(0, 212, 255, 0.3)' },
  ]

  return (
    <section
      id={id}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-16 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="animate-float absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'var(--neon-purple)', opacity: 0.25 }}
        />
        <div
          className="animate-float absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'var(--neon-cyan)', opacity: 0.2, animationDelay: '2s' }}
        />
        <div
          className="animate-float absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'var(--neon-coral)', opacity: 0.12, animationDelay: '4s' }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        {/* LEFT SIDE - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: 'var(--neon-cyan)' }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: 'var(--neon-cyan)' }}
              />
            </span>
            Available for freelance projects
          </motion.div>

          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
            Hi, I&apos;m <span className="text-gradient animate-gradient">{firstName}</span>
            {lastName ? (
              <>
                <br />
                <span className="text-foreground/90">{lastName}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-5 text-lg font-semibold text-muted-foreground md:text-xl">
            <span className="text-gradient-accent">{data.tagline}</span>
          </p>
          <p className="mt-4 max-w-xl text-base text-muted-foreground/90 md:text-lg">{data.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="animate-pulse-glow group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground"
              style={{ background: 'var(--gradient-hero)', backgroundSize: '200% 200%' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work{' '}
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href={data.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-surface-elevated"
            >
              <Download className="h-4 w-4" /> Download Resume
            </motion.a>
          </div>

          <div className="mt-8 flex items-center gap-4 text-muted-foreground">
            <a
              href="https://github.com/usaaman/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-usman-a76984378/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:musmannazir97@gmail.com"
              aria-label="Email"
              className="transition-colors hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Image with Rotating Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto"
        >
          <div
            className="relative"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const y = e.clientY - rect.top
              const centerX = rect.width / 2
              const centerY = rect.height / 2
              const rotateX = ((y - centerY) / centerY) * 15
              const rotateY = ((x - centerX) / centerX) * 15
              const image = e.currentTarget.querySelector('img')
              if (image) {
                image.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                image.style.transition = 'transform 0.1s ease-out'
              }
            }}
            onMouseLeave={(e) => {
              const image = e.currentTarget.querySelector('img')
              if (image) {
                image.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
                image.style.transition = 'transform 0.5s ease-out'
              }
            }}
          >
            {/* Glow Effect */}
            <div
              className="absolute -inset-6 rounded-full blur-3xl"
              style={{ background: 'var(--gradient-hero)', opacity: 0.4 }}
            />

            {/* Image Container */}
            <div
              className="animate-float relative aspect-square w-64 overflow-hidden rounded-full border-4 sm:w-80 md:w-96"
              style={{
                borderColor: 'transparent',
                background:
                  'linear-gradient(var(--background), var(--background)) padding-box, var(--gradient-hero) border-box',
                boxShadow: 'var(--glow-primary)',
              }}
            >
              <img
                src={profileImage}
                alt={`${data.name} portrait`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* 🔥 6 ROTATING LOGO BADGES */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none absolute inset-0"
            >
              {badges.map((badge, index) => {
                // Calculate position on circle (60 degrees apart)
                const angle = (index / badges.length) * 2 * Math.PI - Math.PI / 2
                const radius = 50 // Adjust distance from center
                const x = 50 + radius * Math.cos(angle)
                const y = 50 + radius * Math.sin(angle)
                const Icon = badge.icon

                return (
                  <motion.div
                    key={badge.name}
                    className="pointer-events-auto absolute flex h-11 w-11 items-center justify-center rounded-full border bg-background/80 backdrop-blur-md shadow-lg"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      borderColor: badge.color,
                      boxShadow: `0 0 20px ${badge.glow}, inset 0 0 10px ${badge.glow}`,
                    }}
                    whileHover={{
                      scale: 1.3,
                      boxShadow: `0 0 40px ${badge.glow}`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: badge.color }}
                      strokeWidth={2}
                      aria-label={badge.name}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}