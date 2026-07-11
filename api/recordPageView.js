import { getFirestore } from './_lib/firebaseAdmin.js'
import { handleOptions, setCors } from './_lib/handler.js'

export default async function handler(req, res) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { db, admin } = getFirestore()
    const ref = db.doc('analytics/main')

    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(ref)
      const current = snap.exists ? (snap.data()?.visitorCount ?? 0) : 0
      transaction.set(
        ref,
        {
          visitorCount: current + 1,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('recordPageView error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}
