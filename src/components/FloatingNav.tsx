import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import type { NavItem, ThemeMode } from '../types'

interface FloatingNavProps {
  items: NavItem[]
  activeSection: string
  theme: ThemeMode
  onToggleTheme: () => void
}

export function FloatingNav({ items, activeSection, theme, onToggleTheme }: FloatingNavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onResize = () => setOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 left-1/2 z-50 w-[min(96%,1100px)] -translate-x-1/2 rounded-2xl border border-border bg-background/70 px-4 py-3 backdrop-blur-xl md:px-6"
      style={{ boxShadow: '0 8px 32px oklch(0 0 0 / 0.25)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => scrollTo('home')}
          className="font-display text-lg font-bold tracking-tight"
        >
          <span className="text-gradient">MU</span>
          <span className="ml-1 text-foreground/70">.dev</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {activeSection === item.id ? (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg"
                  style={{ background: 'var(--gradient-accent)', opacity: 0.15 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-border p-2 transition-colors hover:bg-surface-elevated"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-lg border border-border p-2 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 flex flex-col gap-1 md:hidden"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm ${
                activeSection === item.id
                  ? 'bg-surface-elevated text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.nav>
      ) : null}
    </motion.header>
  )
}
