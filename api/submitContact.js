import { sendAdminEmail } from './_lib/email.js'
import { getFirestore } from './_lib/firebaseAdmin.js'
import { handleOptions, readJsonBody, setCors } from './_lib/handler.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = await readJsonBody(req)
    const { name, email, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' })
    }

    const { db, admin } = getFirestore()
    const docRef = await db.collection('contactSubmissions').add({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      read: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })

    await sendAdminEmail(
      `New Contact Form: ${name.trim()}`,
      `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, '<br>')}</p>
        <p><em>Received via portfolio contact form</em></p>
      `,
    )

    return res.status(200).json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('submitContact error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}
