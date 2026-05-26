import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[AuthContext] Initializing...')
    
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('[AuthContext] getSession result:', { session: !!session, error: error?.message })
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] onAuthStateChange:', event, 'user:', !!session?.user)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    console.log('[AuthContext] signUp called with:', { email })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: email.split('@')[0] },
        },
      })
      console.log('[AuthContext] signUp result:', { data: !!data, error: error?.message, userId: data?.user?.id })
      if (error) return { data: null, error }
      return { data, error: null }
    } catch (err) {
      console.error('[AuthContext] signUp exception:', err)
      return { data: null, error: { message: 'Network error. Check your Supabase URL in .env file.' } }
    }
  }

  const signIn = async (email, password) => {
    console.log('[AuthContext] signIn called with:', { email })
    console.log('[AuthContext] Supabase URL being used:', supabase.supabaseUrl)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('[AuthContext] signIn result:', { data: !!data, error: error?.message, userId: data?.user?.id })
      if (error) return { data: null, error }
      return { data, error: null }
    } catch (err) {
      console.error('[AuthContext] signIn exception:', err)
      return { data: null, error: { message: 'Network error. Check your Supabase URL in .env file.' } }
    }
  }

  const signOut = async () => {
    console.log('[AuthContext] signOut called')
    await supabase.auth.signOut()
  }

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('[AuthContext] getToken:', !!session?.access_token)
    return session?.access_token
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
