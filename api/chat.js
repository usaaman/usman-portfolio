import { callGroq } from './_lib/groq.js'
import { handleOptions, readJsonBody, setCors } from './_lib/handler.js'
import { buildPortfolioContext } from './_lib/portfolioContext.js'
import { checkRateLimit, getClientIp } from './_lib/rateLimit.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const ip = getClientIp(req)
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
    }

    const body = await readJsonBody(req)
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' })
    }

    const context = await buildPortfolioContext()
    const systemMessage = { role: 'system', content: context }
    const reply = await callGroq([systemMessage, ...messages])

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('chat error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('not configured') ? 500 : 500
    return res.status(status).json({ error: message })
  }
}
