import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// These should match your web app's Supabase configuration
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

// Job-related functions
export const fetchJobs = async (userId: string) => {
  try {
    // Mock data for demo - in production this would fetch from your jobs table
    return {
      data: [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          salary: '$120k - $150k',
          isVerified: true,
          remote: true,
          description: 'We are looking for a senior frontend developer...',
          skills: ['React', 'TypeScript', 'Node.js'],
          matchScore: 92,
          logo: '🚀'
        },
        {
          id: '2',
          title: 'Product Manager',
          company: 'StartupXYZ',
          location: 'New York, NY',
          salary: '$100k - $130k',
          isVerified: false,
          remote: false,
          description: 'Join our product team to drive vision...',
          skills: ['Product Strategy', 'Analytics', 'User Research'],
          matchScore: 78,
          logo: '💼'
        },
        {
          id: '3',
          title: 'UX Designer',
          company: 'Design Studio Pro',
          location: 'Austin, TX',
          salary: '$80k - $110k',
          isVerified: true,
          remote: true,
          description: 'Create beautiful, intuitive user experiences...',
          skills: ['Figma', 'User Research', 'Prototyping'],
          matchScore: 85,
          logo: '🎨'
        }
      ],
      error: null
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const applyToJob = async (userId: string, jobId: string) => {
  try {
    // This would create an application record in your applications table
    console.log(`User ${userId} applied to job ${jobId}`);
    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};