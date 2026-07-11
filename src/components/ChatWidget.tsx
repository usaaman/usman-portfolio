import { AnimatePresence, motion } from 'framer-motion'
import { Bot, MessageCircle, Send, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage, summarizeChatSession } from '../services/api'
import type { ChatMessage } from '../types'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000
const WELCOME_MESSAGE =
  "Hi! I'm Muhammad Usman's portfolio assistant. Ask me about his skills, projects, services, or availability for freelance work."

interface ChatWidgetProps {
  className?: string
}

export function ChatWidget({ className }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [showVisitorForm, setShowVisitorForm] = useState(false)
  const idleTimerRef = useRef<number | null>(null)
  const summarizedRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, open])

  const summarizeIfNeeded = useCallback(async () => {
    if (summarizedRef.current) return
    const userMessages = messages.filter((m) => m.role === 'user')
    if (userMessages.length === 0) return

    summarizedRef.current = true
    const visitorInfo =
      visitorName || visitorEmail
        ? { name: visitorName || undefined, email: visitorEmail || undefined }
        : undefined

    await summarizeChatSession(messages, visitorInfo)
  }, [messages, visitorEmail, visitorName])

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current)
    }
    idleTimerRef.current = window.setTimeout(() => {
      if (open) {
        void summarizeIfNeeded()
        setOpen(false)
      }
    }, IDLE_TIMEOUT_MS)
  }, [open, summarizeIfNeeded])

  useEffect(() => {
    if (open) {
      resetIdleTimer()
    }
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
    }
  }, [open, resetIdleTimer, messages])

  const handleClose = async () => {
    await summarizeIfNeeded()
    setOpen(false)
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }])
    setInput('')
    summarizedRef.current = false
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    resetIdleTimer()

    try {
      const reply = await sendChatMessage(
        nextMessages.map((m) => ({ role: m.role, content: m.content })),
      )
      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Sorry, I am temporarily unavailable. Please try again later.',
        },
      ])
    } finally {
      setLoading(false)
      resetIdleTimer()
    }
  }

  return (
    <div className={className}>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-[60] flex h-[min(520px,70vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface)_95%,transparent),color-mix(in_oklab,var(--color-bg)_92%,transparent))] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-slate-950">
                  <Bot size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">Portfolio Assistant</p>
                  <p className="text-xs text-[color:color-mix(in_oklab,var(--color-text)_60%,transparent)]">
                    Powered by AI
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleClose()}
                className="rounded-full border border-white/10 p-2 text-[var(--color-text)] transition hover:border-[var(--color-primary)]"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === 'user'
                        ? 'bg-[var(--color-primary)] text-slate-950'
                        : 'border border-white/10 bg-black/10 text-[var(--color-text)]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <p className="text-xs text-[color:color-mix(in_oklab,var(--color-text)_55%,transparent)]">
                  Thinking...
                </p>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 p-4">
              {showVisitorForm ? (
                <div className="mb-3 grid gap-2">
                  <input
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                  />
                  <input
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVisitorForm(true)}
                  className="mb-3 text-xs text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  Share your contact info (optional)
                </button>
              )}

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void handleSend()
                    }
                  }}
                  placeholder="Ask about skills, projects, services..."
                  className="flex-1 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 text-slate-950 transition hover:opacity-90 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-20 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] text-slate-950 shadow-[0_0_35px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] transition hover:-translate-y-1"
        aria-label={open ? 'Close chat widget' : 'Open chat widget'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
