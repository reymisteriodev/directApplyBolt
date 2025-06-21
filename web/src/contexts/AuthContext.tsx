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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)
        
        // Only check CV completion if we have a user
        if (session?.user) {
          // Don't await this - let it run in background
          checkCVCompletion(session.user.id).catch(console.error)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, 'User:', session?.user?.email)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Don't await this - let it run in background
          checkCVCompletion(session.user.id).catch(console.error)
        } else {
          setHasCompletedCV(false)
        }
        
        // Always set loading to false after auth state change
        setLoading(false)
      }
    )

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
  }, [])

  const checkCVCompletion = async (userId: string) => {
    try {
      console.log('Checking CV completion for user:', userId)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cv_data')
        .eq('user_id', userId)

      if (error) {
        console.error('Error checking CV completion:', error)
        setHasCompletedCV(false)
        return
      }

      if (!data || data.length === 0) {
        console.log('No CV data found - user has not completed CV')
        setHasCompletedCV(false)
        return
      }

      // Check if any CV exists with meaningful content
      const hasAnyCV = data.some(record => {
        const cvData = record.cv_data;
        if (!cvData) return false;
        
        const hasBasicInfo = cvData.personalInfo?.email || cvData.personalInfo?.fullName;
        const hasContent = 
          (cvData.professionalSummary && cvData.professionalSummary.trim().length > 0) ||
          (cvData.employmentHistory && Array.isArray(cvData.employmentHistory) && cvData.employmentHistory.length > 0) ||
          (cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0) ||
          (cvData.uploadedFile && cvData.uploadedFile.extractedText && cvData.uploadedFile.extractedText.trim().length > 0);
        
        return hasBasicInfo && hasContent;
      });
      
      console.log('Final CV completion status:', hasAnyCV)
      setHasCompletedCV(hasAnyCV);
    } catch (error) {
      console.error('Error checking CV completion:', error)
      setHasCompletedCV(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
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
      
      return { error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      console.log('Sign in successful for:', email)
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      setHasCompletedCV(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    hasCompletedCV,
    setHasCompletedCV
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}