import { MoonStar, SunMedium } from 'lucide-react'
import type { ThemeMode } from '../types'

interface ThemeToggleProps {
  theme: ThemeMode
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-[var(--color-text)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </button>
  )
}
