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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      if (session?.user) {
        checkUserStatus(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'User:', session?.user?.email || 'No user')
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkUserStatus(session.user.id)
        } else {
          setHasCompletedCV(false)
          setHasSeenWelcome(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUserStatus = async (userId: string) => {
    try {
      console.log('Checking user status for:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cv_data, has_seen_welcome')
        .eq('user_id', userId)
        .limit(1)

      console.log('User status check result:', { data, error })

      if (error) {
        console.error('Error checking user status:', error)
        setHasCompletedCV(false)
        setHasSeenWelcome(false)
        return
      }

      if (!data || data.length === 0) {
        console.log('No user profile found - new user')
        setHasCompletedCV(false)
        setHasSeenWelcome(false)
        return
      }

      const profile = data[0]
      
      // Check if user has seen welcome
      const seenWelcome = profile.has_seen_welcome || false
      setHasSeenWelcome(seenWelcome)
      console.log('Has seen welcome:', seenWelcome)

      // Check CV completion
      const cvData = profile.cv_data
      if (!cvData) {
        console.log('No CV data found')
        setHasCompletedCV(false)
        return
      }

      const hasBasicInfo = cvData.personalInfo?.email
      const hasContent = cvData.professionalSummary || 
                       (cvData.employmentHistory && cvData.employmentHistory.length > 0) ||
                       cvData.uploadedFile

      const cvCompleted = hasBasicInfo && hasContent
      console.log('CV completion status:', cvCompleted)
      setHasCompletedCV(cvCompleted)
      
    } catch (error) {
      console.error('Error checking user status:', error)
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true)
      console.log('Attempting signup for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }
      
      console.log('Signup successful for:', email)
      return { error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      console.log('Attempting signin for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      console.log('Signin successful for:', email)
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    } catch (error) {
      console.error('Sign out error:', error)
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