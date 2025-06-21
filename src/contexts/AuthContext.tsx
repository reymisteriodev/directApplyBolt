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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Check CV completion in background, don't block loading
        checkCVCompletion(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // For sign in events, check CV completion but don't block
          checkCVCompletion(session.user.id)
        } else {
          setHasCompletedCV(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkCVCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cv_data')
        .eq('user_id', userId)
        .limit(1) // Only get one record to check existence

      if (!error && data && data.length > 0) {
        // Quick check - if any CV exists with basic data, consider it complete
        const hasAnyCV = data.some(record => {
          const cvData = record.cv_data;
          if (!cvData) return false;
          
          // Simplified check - just need email and either summary, experience, or uploaded file
          const hasBasicInfo = cvData.personalInfo?.email;
          const hasContent = cvData.professionalSummary || 
                           (cvData.employmentHistory && cvData.employmentHistory.length > 0) ||
                           cvData.uploadedFile;
          
          return hasBasicInfo && hasContent;
        });
        
        setHasCompletedCV(hasAnyCV);
      } else {
        setHasCompletedCV(false)
      }
    } catch (error) {
      console.error('Error checking CV completion:', error)
      setHasCompletedCV(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        
        // Enhanced error handling for rate limiting
        if (error.message?.includes('For security purposes, you can only request this after') ||
            error.message?.includes('over_email_send_rate_limit') ||
            error.status === 429) {
          // Return the original error with rate limit information
          return { 
            error: {
              ...error,
              isRateLimit: true,
              status: 429
            }
          }
        }
        
        return { error }
      }
      
      return { error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      
      // Handle rate limiting in catch block as well
      if (error?.message?.includes('For security purposes, you can only request this after') ||
          error?.message?.includes('over_email_send_rate_limit') ||
          error?.status === 429) {
        return { 
          error: {
            ...error,
            isRateLimit: true,
            status: 429
          }
        }
      }
      
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
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
    setHasCompletedCV
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}