import type { ChatMessage, ContactFormValues } from '../types'

const API_BASE = '/api'

export async function submitContactForm(values: ContactFormValues) {
  const response = await fetch(`${API_BASE}/submitContact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to send message.' }))
    throw new Error(error.error ?? 'Failed to send message.')
  }

  return response.json()
}

export async function sendChatMessage(messages: ChatMessage[]) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Chat unavailable.' }))
    throw new Error(error.error ?? 'Chat unavailable.')
  }

  const data = await response.json()
  return data.reply as string
}

export async function summarizeChatSession(
  transcript: ChatMessage[],
  visitorInfo?: { name?: string; email?: string },
) {
  const response = await fetch(`${API_BASE}/summarizeChat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, visitorInfo }),
  })

  if (!response.ok) {
    console.warn('Failed to summarize chat session')
    return null
  }

  return response.json()
}

export async function recordPageView() {
  try {
    await fetch(`${API_BASE}/recordPageView`, { method: 'POST' })
  } catch {
    // Non-blocking analytics
  }
}
