import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  // Create a mock user for development
  const mockUser = {
    id: 'mock-user-id',
    email: 'dev@example.com',
    user_metadata: {
      name: 'Development User'
    }
  }
  
  const [user, setUser] = useState(mockUser) // Set mock user by default
  const [loading, setLoading] = useState(false) // Set loading to false immediately
  const [bypassAuth, setBypassAuth] = useState(true) // Flag to control auth bypass

  useEffect(() => {
    // Only run auth checks if not bypassing
    if (!bypassAuth) {
      // Check for active session on initial load
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession()
        setUser(data?.session?.user || mockUser) // Fall back to mock user
        setLoading(false)
        
        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user || mockUser) // Fall back to mock user
          }
        )
        
        return () => {
          authListener?.subscription?.unsubscribe()
        }
      }
      
      checkSession()
    }
  }, [bypassAuth])

  // Sign up function (mocked)
  const signUp = async (email, password) => {
    if (bypassAuth) {
      return { success: true }
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign in function (mocked)
  const signIn = async (email, password) => {
    if (bypassAuth) {
      return { success: true }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign out function (mocked)
  const signOut = async () => {
    if (bypassAuth) {
      // Don't actually sign out in bypass mode
      return { success: true }
    }
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Toggle auth bypass
  const toggleAuthBypass = () => {
    setBypassAuth(prev => !prev)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    bypassAuth,
    toggleAuthBypass
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
