import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

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