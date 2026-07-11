import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyDyJGJYVVCpY8G_9P-SF2RozAOM9M7IUfY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'portfolio-8fa57.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'portfolio-8fa57',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'portfolio-8fa57.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '147838346424',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:147838346424:web:cfc8867a8c968ad739404d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-NSEB4LM744',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
