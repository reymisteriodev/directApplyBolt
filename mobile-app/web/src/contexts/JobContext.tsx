import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchJobs, applyToJob } from '../utils/supabase';
import { useAuth } from './AuthContext';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  isVerified: boolean;
  remote: boolean;
  description: string;
  skills: string[];
  matchScore: number;
  logo: string;
}

interface JobContextType {
  jobs: Job[];
  currentJobIndex: number;
  applications: string[];
  loading: boolean;
  swipeRight: (jobId: string) => Promise<void>;
  swipeLeft: (jobId: string) => void;
  loadJobs: () => Promise<void>;
  getCurrentJob: () => Job | null;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [applications, setApplications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await fetchJobs(user.id);
      if (!error && data) {
        setJobs(data);
        setCurrentJobIndex(0);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const swipeRight = async (jobId: string) => {
    if (!user) return;
    
    try {
      const { error } = await applyToJob(user.id, jobId);
      if (!error) {
        setApplications(prev => [...prev, jobId]);
        nextJob();
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const swipeLeft = (jobId: string) => {
    nextJob();
  };

  const nextJob = () => {
    setCurrentJobIndex(prev => prev + 1);
  };

  const getCurrentJob = () => {
    if (currentJobIndex < jobs.length) {
      return jobs[currentJobIndex];
    }
    return null;
  };

  const value = {
    jobs,
    currentJobIndex,
    applications,
    loading,
    swipeRight,
    swipeLeft,
    loadJobs,
    getCurrentJob
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};