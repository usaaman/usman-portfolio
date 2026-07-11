import admin from 'firebase-admin'

let db = null

export function getFirestore() {
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!raw) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not configured.')
    }

    const decoded = Buffer.from(raw, 'base64').toString('utf-8')
    const serviceAccount = JSON.parse(decoded)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  if (!db) {
    db = admin.firestore()
  }

  return { db, admin }
}
