import { AnimatePresence, motion } from 'framer-motion'
import { Bot, MessageSquare, Send, User, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage, summarizeChatSession } from '../services/api'
import type { ChatMessage } from '../types'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000
const WELCOME_MESSAGE =
  "Hey! 👋 I'm Usman's AI assistant. Ask me about his projects, skills, or how to hire him."

export function ChatWidget() {
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
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
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
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
    idleTimerRef.current = window.setTimeout(() => {
      if (open) {
        void summarizeIfNeeded()
        setOpen(false)
      }
    }, IDLE_TIMEOUT_MS)
  }, [open, summarizeIfNeeded])

  useEffect(() => {
    if (open) resetIdleTimer()
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
              : 'Connection hiccup — please try again.',
        },
      ])
    } finally {
      setLoading(false)
      resetIdleTimer()
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        type="button"
        onClick={() => (open ? void handleClose() : setOpen(true))}
        aria-label="Open chat assistant"
        className="animate-pulse-glow fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg md:right-8 md:bottom-8"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed right-4 bottom-24 z-40 flex h-[min(70vh,560px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 backdrop-blur-xl md:right-8"
            style={{ boxShadow: '0 20px 60px oklch(0 0 0 / 0.4)' }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 text-primary-foreground"
              style={{ background: 'var(--gradient-hero)' }}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <div className="text-sm font-bold">Ask Usman&apos;s AI</div>
                  <div className="text-[11px] opacity-80">Powered by Groq · usually replies instantly</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleClose()}
                aria-label="Close"
                className="rounded p-1 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: m.role === 'user' ? 'var(--surface-elevated)' : 'var(--gradient-accent)',
                    }}
                  >
                    {m.role === 'user' ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-surface-elevated'
                        : 'rounded-tl-sm bg-surface'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </span>
                  thinking…
                </div>
              ) : null}
            </div>

            <div className="border-t border-border p-3">
              {showVisitorForm ? (
                <div className="mb-2 grid gap-2">
                  <input
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVisitorForm(true)}
                  className="mb-2 text-xs text-primary underline-offset-2 hover:underline"
                >
                  Share your contact info (optional)
                </button>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something…"
                  maxLength={500}
                  className="flex-1 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground disabled:opacity-50"
                  style={{ background: 'var(--gradient-hero)' }}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
