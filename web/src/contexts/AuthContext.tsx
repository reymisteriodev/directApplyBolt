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
      setUser(session?.user ?? null)
      if (session?.user) {
        // Check CV completion and welcome status in background
        checkUserStatus(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'User:', session?.user?.email)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // For sign in events, check user status but don't block
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
      console.log('Checking user status for user:', userId)
      
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

      const userProfile = data[0]
      
      // Check welcome status
      const welcomeStatus = userProfile.has_seen_welcome || false
      console.log('Welcome status:', welcomeStatus)
      setHasSeenWelcome(welcomeStatus)

      // Check CV completion
      const cvData = userProfile.cv_data
      if (!cvData) {
        console.log('CV data is null/undefined')
        setHasCompletedCV(false)
        return
      }
      
      // More thorough check for CV completion
      const hasBasicInfo = cvData.personalInfo?.email
      const hasContent = cvData.professionalSummary || 
                       (cvData.employmentHistory && cvData.employmentHistory.length > 0) ||
                       cvData.uploadedFile
      
      console.log('CV completion check:', {
        hasBasicInfo,
        hasContent,
        hasSummary: !!cvData.professionalSummary,
        hasEmployment: !!(cvData.employmentHistory && cvData.employmentHistory.length > 0),
        hasUploadedFile: !!cvData.uploadedFile
      })
      
      const cvCompleted = hasBasicInfo && hasContent
      console.log('Final CV completion status:', cvCompleted)
      setHasCompletedCV(cvCompleted)
    } catch (error) {
      console.error('Error checking user status:', error)
      setHasCompletedCV(false)
      setHasSeenWelcome(false)
    }
  }

  const markWelcomeSeen = async (userId: string) => {
    try {
      console.log('Marking welcome as seen for user:', userId)
      
      // First check if user profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError)
        return
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            has_seen_welcome: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error updating welcome status:', updateError)
        } else {
          console.log('Welcome status updated successfully')
          setHasSeenWelcome(true)
        }
      } else {
        // Create new profile with welcome seen
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            has_seen_welcome: true,
            cv_data: null,
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating profile with welcome status:', insertError)
        } else {
          console.log('Profile created with welcome status')
          setHasSeenWelcome(true)
        }
      }
    } catch (error) {
      console.error('Error marking welcome as seen:', error)
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
      
      console.log('Sign in successful for:', email)
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
    setHasSeenWelcome: (seen: boolean) => {
      setHasSeenWelcome(seen)
      if (seen && user) {
        markWelcomeSeen(user.id)
      }
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}