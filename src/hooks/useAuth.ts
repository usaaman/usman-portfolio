import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'

const ADMIN_EMAIL = 'musmannazir97@gmail.com'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const isAdmin = user?.email === ADMIN_EMAIL

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    if (credential.user.email !== ADMIN_EMAIL) {
      await signOut(auth)
      throw new Error('You do not have admin access.')
    }
    return credential.user
  }

  const logout = () => signOut(auth)

  return { user, loading, isAdmin, login, logout }
}
