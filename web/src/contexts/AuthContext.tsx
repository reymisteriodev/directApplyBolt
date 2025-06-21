import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  hasCompletedCV: boolean
  setHasCompletedCV: (completed: boolean) => void
  hasSeenWelcome: boolean
  setHasSeenWelcome: (seen: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedCV, setHasCompletedCV] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session check:', session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Load user status in background
        loadUserStatus(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, session?.user?.email || 'No user')
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserStatus(session.user.id)
        } else {
          // Reset states when user logs out
          setHasCompletedCV(false)
          setHasSeenWelcome(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserStatus = async (userId: string) => {
    try {
      console.log('📊 Loading user status for:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cv_data, has_seen_welcome')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('❌ Error loading user status:', error)
        setHasCompletedCV(false)
        setHasSeenWelcome(false)
        return
      }

      if (!data) {
        console.log('👤 New user - no profile found')
        setHasCompletedCV(false)
        setHasSeenWelcome(false)
        return
      }

      // Check welcome status
      const welcomeStatus = data.has_seen_welcome || false
      console.log('👋 Welcome status:', welcomeStatus)
      setHasSeenWelcome(welcomeStatus)

      // Check CV completion
      const cvData = data.cv_data
      if (!cvData) {
        console.log('📄 No CV data found')
        setHasCompletedCV(false)
        return
      }
      
      // Simple CV completion check
      const hasBasicInfo = cvData.personalInfo?.email
      const hasContent = cvData.professionalSummary || 
                       (cvData.employmentHistory && cvData.employmentHistory.length > 0) ||
                       cvData.uploadedFile
      
      const cvCompleted = hasBasicInfo && hasContent
      console.log('✅ CV completion status:', cvCompleted)
      setHasCompletedCV(cvCompleted)
      
    } catch (error) {
      console.error('💥 Error loading user status:', error)
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('📝 Signing up user:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('❌ Sign up error:', error)
        return { error }
      }
      
      console.log('✅ Sign up successful')
      return { error: null }
    } catch (error) {
      console.error('💥 Sign up error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        return { error }
      }
      
      console.log('✅ Sign in successful')
      return { error: null }
    } catch (error) {
      console.error('💥 Sign in error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out user')
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Sign out error:', error)
      }
      
      // Reset all states
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
      
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('💥 Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    hasCompletedCV,
    setHasCompletedCV,
    hasSeenWelcome,
    setHasSeenWelcome
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}