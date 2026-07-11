import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Check, MessageCircle, Send } from 'lucide-react'
import type { ContactFormValues, ContactLinkItem } from '../types'

interface ContactSectionProps {
  id: string
  links: ContactLinkItem[]
  onSubmit?: (values: ContactFormValues) => Promise<void> | void
}

export function ContactSection({ id, links, onSubmit }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormValues>({ name: '', email: '', message: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email.')
      return
    }
    if (form.message.length > 1000) {
      setError('Message is too long (max 1000 chars).')
      return
    }

    setState('sending')
    try {
      await onSubmit?.(form)
      setState('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setState('idle'), 3500)
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again or email directly.')
    }
  }

  return (
    <section id={id} className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MessageCircle className="h-4 w-4" style={{ color: 'var(--neon-purple)' }} />
            <span>Contact</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Let&apos;s build <span className="text-gradient">something</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Have a project in mind or just want to say hi? Drop a message — I usually reply within 24
            hours.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {links.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-4 backdrop-blur transition-all hover:border-primary/60 hover:bg-surface-elevated"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'var(--gradient-accent)' }}
                  >
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground">{link.label}</div>
                    <div className="truncate font-medium">{link.value}</div>
                  </div>
                </a>
              )
            })}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur md:p-8"
          >
            <div className="space-y-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                maxLength={100}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                maxLength={255}
              />
              <Field
                label="Message"
                textarea
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                maxLength={1000}
              />

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                style={{ background: 'var(--gradient-hero)', backgroundSize: '200% 200%' }}
              >
                {state === 'sent' ? (
                  <>
                    <Check className="h-4 w-4" /> Sent!
                  </>
                ) : state === 'sending' ? (
                  'Sending…'
                ) : (
                  <>
                    Send message{' '}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  textarea,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  textarea?: boolean
  maxLength?: number
}) {
  const shared =
    'w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary'
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={5}
          placeholder={`Your ${label.toLowerCase()}…`}
          className={shared + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={`Your ${label.toLowerCase()}…`}
          className={shared}
        />
      )}
    </label>
  )
}
