import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the same Supabase configuration as the web platform
const supabaseUrl = 'https://sflsmtiglvcalhujjswf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbHNtdGlnbHZjYWxodWpqc3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDcxOTUsImV4cCI6MjA2NTU4MzE5NX0.d-rRjMsOC0IIoy6-l2qN9amKsJd9PWZzNX53eDDueOE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const initializeSupabase = () => {
  console.log('Supabase initialized for DirectApply Mobile');
};

// Job-related functions for future integration
export const fetchJobs = async (userId: string) => {
  try {
    // In production, this would fetch from the jobs table
    // const { data, error } = await supabase
    //   .from('jobs')
    //   .select('*')
    //   .eq('is_active', true)
    //   .order('created_at', { ascending: false });
    
    // For now, return mock data for rich experience
    return {
      data: [],
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const applyToJob = async (userId: string, jobId: string) => {
  try {
    // In production, this would create an application record
    // const { data, error } = await supabase
    //   .from('applications')
    //   .insert({
    //     user_id: userId,
    //     job_id: jobId,
    //     status: 'applied',
    //     applied_at: new Date().toISOString()
    //   });
    
    console.log(`User ${userId} applied to job ${jobId}`);
    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};