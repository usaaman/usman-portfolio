import clsx from 'clsx'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { NavItem } from '../types'

interface FloatingNavProps {
  items: NavItem[]
  activeSection: string
}

export function FloatingNav({ items, activeSection }: FloatingNavProps) {
  const [open, setOpen] = useState(false)

  const handleClick = () => setOpen(false)

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[color:color-mix(in_oklab,var(--color-surface)_82%,transparent)] px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <a href="#home" className="px-3 font-display text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-text)]">
          MU
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                activeSection === item.id
                  ? 'bg-[var(--color-primary)] text-slate-950 shadow-[0_0_30px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]'
                  : 'text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)] hover:bg-white/[0.08] hover:text-[var(--color-text)]',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[var(--color-text)] md:hidden"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 flex max-w-6xl flex-col gap-2 rounded-3xl border border-white/10 bg-[color:color-mix(in_oklab,var(--color-surface)_88%,transparent)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleClick}
              className={clsx(
                'rounded-2xl px-4 py-3 text-sm font-medium transition',
                activeSection === item.id
                  ? 'bg-[var(--color-primary)] text-slate-950'
                  : 'text-[var(--color-text)] hover:bg-white/[0.08]',
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  )
}
