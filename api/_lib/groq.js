const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function callGroq(messages, temperature = 0.7) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured.')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq API error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? 'Sorry, I could not generate a response.'
}
