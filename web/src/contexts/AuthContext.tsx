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
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Session error:', error)
      } else {
        console.log('✅ Initial session:', session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        if (session?.user) {
          checkUserStatus(session.user.id)
        }
      }
      setLoading(false) // Always set loading to false after initial check
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, 'User:', session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkUserStatus(session.user.id)
        } else {
          setHasCompletedCV(false)
          setHasSeenWelcome(false)
        }
        // Don't set loading to false here for auth state changes
      }
    )

    return () => {
      console.log('🧹 Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const checkUserStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking user status for:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cv_data, has_seen_welcome')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('❌ Error checking user status:', error)
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
      const seenWelcome = data.has_seen_welcome || false
      setHasSeenWelcome(seenWelcome)
      console.log('👋 Has seen welcome:', seenWelcome)

      // Check CV completion
      const cvData = data.cv_data
      if (!cvData) {
        console.log('📄 No CV data found')
        setHasCompletedCV(false)
        return
      }

      const hasBasicInfo = cvData.personalInfo?.email
      const hasContent = cvData.professionalSummary || 
                       (cvData.employmentHistory && cvData.employmentHistory.length > 0) ||
                       cvData.uploadedFile

      const cvCompleted = hasBasicInfo && hasContent
      console.log('📋 CV completion status:', cvCompleted)
      setHasCompletedCV(cvCompleted)
      
    } catch (error) {
      console.error('💥 Error checking user status:', error)
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('📝 Starting signup for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('❌ Signup error:', error)
        return { error }
      }
      
      console.log('✅ Signup successful for:', email)
      return { error: null }
    } catch (error: any) {
      console.error('💥 Signup exception:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting signin for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Signin error:', error)
        return { error }
      }
      
      console.log('✅ Signin successful for:', email)
      return { error: null }
    } catch (error) {
      console.error('💥 Signin exception:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Sign out error:', error)
      } else {
        console.log('✅ Signed out successfully')
      }
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    } catch (error) {
      console.error('💥 Sign out exception:', error)
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