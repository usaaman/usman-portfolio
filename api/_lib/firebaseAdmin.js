import admin from 'firebase-admin'

let db = null

export function getFirestore() {
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!raw) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not configured.')
    }

    const serviceAccount = JSON.parse(raw)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  }

  if (!db) {
    db = admin.firestore()
  }

  return { db, admin }
}
