import React, { createContext, useContext, useState } from 'react';

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
  swipeRight: (jobId: string) => void;
  swipeLeft: (jobId: string) => void;
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
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [applications, setApplications] = useState<string[]>([]);

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      isVerified: true,
      remote: true,
      description: 'We are looking for a senior frontend developer to join our growing team.',
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
      description: 'Join our product team to drive the vision and strategy.',
      skills: ['Product Strategy', 'Analytics', 'User Research'],
      matchScore: 78,
      logo: '💼'
    }
  ];

  const swipeRight = (jobId: string) => {
    setApplications(prev => [...prev, jobId]);
    nextJob();
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
    swipeRight,
    swipeLeft,
    getCurrentJob
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};