import { Send } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { ContactFormValues, ContactLinkItem } from '../types'
import { ScrollReveal } from './ScrollReveal'
import { SectionIntro } from './SectionIntro'

interface ContactSectionProps {
  id: string
  links: ContactLinkItem[]
  onSubmit?: (values: ContactFormValues) => Promise<void> | void
}

type FormErrors = Partial<Record<keyof ContactFormValues, string>>

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  message: '',
}

export function ContactSection({ id, links, onSubmit }: ContactSectionProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const linkCards = useMemo(() => links, [links])

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!values.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!values.message.trim()) nextErrors.message = 'Please enter your message.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')

    if (!validate()) {
      return
    }

    try {
      setSubmitting(true)
      await onSubmit?.(values)
      setStatus('Message sent successfully. Muhammad will get back to you soon.')
      setValues(initialValues)
      setErrors({})
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id={id} className="px-4 pt-20 pb-24 md:py-24 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Contact"
          title="Let’s build something intelligent, useful, and visually sharp."
          subtitle="The contact UI is complete with validation and a prop-based submit hook, ready for backend wiring in the next phase."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
            <div className="grid gap-4">
              {linkCards.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/10 px-4 py-4 transition hover:-translate-y-1 hover:border-[var(--color-primary)]"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-slate-950">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[color:color-mix(in_oklab,var(--color-text)_58%,transparent)]">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--color-text)]">{link.value}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
            <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                  placeholder="Your name"
                />
                {errors.name ? <p className="mt-2 text-sm text-rose-400">{errors.name}</p> : null}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                  placeholder="you@example.com"
                />
                {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={values.message}
                  onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
                  className="w-full rounded-[1.5rem] border border-white/10 bg-black/10 px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                  placeholder="Tell me about your project..."
                />
                {errors.message ? <p className="mt-2 text-sm text-rose-400">{errors.message}</p> : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_35px_color-mix(in_oklab,var(--color-primary)_42%,transparent)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
                {status ? (
                  <p className="text-sm text-[color:color-mix(in_oklab,var(--color-text)_72%,transparent)]">
                    {status}
                  </p>
                ) : null}
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
