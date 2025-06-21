import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
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

  // Pre-populated job database for rich first-time experience
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      isVerified: true,
      remote: true,
      description: 'Join our innovative team building next-generation web applications using React, TypeScript, and modern development practices. You\'ll work on cutting-edge projects that impact millions of users.',
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
      description: 'Drive product strategy for our consumer-facing applications. Work closely with engineering and design teams to deliver exceptional user experiences.',
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
      description: 'Create beautiful, intuitive user experiences for our client projects. Work with a talented team of designers and developers.',
      skills: ['Figma', 'User Research', 'Prototyping'],
      matchScore: 85,
      logo: '🎨'
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      salary: '$110k - $140k',
      isVerified: true,
      remote: false,
      description: 'Build scalable backend services using cutting-edge technology. Work on distributed systems that handle millions of requests.',
      skills: ['Python', 'AWS', 'Kubernetes'],
      matchScore: 67,
      logo: '☁️'
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'AI Innovations',
      location: 'Boston, MA',
      salary: '$130k - $160k',
      isVerified: true,
      remote: true,
      description: 'Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets and cutting-edge ML frameworks.',
      skills: ['Python', 'Machine Learning', 'SQL'],
      matchScore: 88,
      logo: '🤖'
    },
    {
      id: '6',
      title: 'Mobile Developer',
      company: 'AppCraft Studios',
      location: 'Los Angeles, CA',
      salary: '$95k - $125k',
      isVerified: false,
      remote: true,
      description: 'Develop native mobile applications for iOS and Android. Create smooth, performant apps that users love.',
      skills: ['React Native', 'Swift', 'Kotlin'],
      matchScore: 82,
      logo: '📱'
    },
    {
      id: '7',
      title: 'DevOps Engineer',
      company: 'Infrastructure Pro',
      location: 'Denver, CO',
      salary: '$115k - $145k',
      isVerified: true,
      remote: true,
      description: 'Manage cloud infrastructure and deployment pipelines. Ensure high availability and scalability of our systems.',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      matchScore: 75,
      logo: '⚙️'
    },
    {
      id: '8',
      title: 'Full Stack Developer',
      company: 'WebFlow Dynamics',
      location: 'Portland, OR',
      salary: '$90k - $120k',
      isVerified: false,
      remote: true,
      description: 'Work on both frontend and backend development. Build complete web applications from concept to deployment.',
      skills: ['JavaScript', 'React', 'Node.js'],
      matchScore: 89,
      logo: '💻'
    },
    {
      id: '9',
      title: 'Security Engineer',
      company: 'CyberShield Corp',
      location: 'Washington, DC',
      salary: '$125k - $155k',
      isVerified: true,
      remote: false,
      description: 'Protect our systems and data from security threats. Implement security best practices and conduct vulnerability assessments.',
      skills: ['Cybersecurity', 'Penetration Testing', 'Python'],
      matchScore: 71,
      logo: '🛡️'
    },
    {
      id: '10',
      title: 'Machine Learning Engineer',
      company: 'Neural Networks Inc',
      location: 'San Jose, CA',
      salary: '$140k - $170k',
      isVerified: true,
      remote: true,
      description: 'Deploy machine learning models at scale. Work on recommendation systems, computer vision, and natural language processing.',
      skills: ['TensorFlow', 'Python', 'MLOps'],
      matchScore: 94,
      logo: '🧠'
    }
  ];

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // For now, use mock data for rich experience
      // In production, this would fetch from Supabase jobs table
      setJobs(mockJobs);
      setCurrentJobIndex(0);
    } catch (error) {
      console.error('Error loading jobs:', error);
      // Fallback to mock data
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const swipeRight = async (jobId: string) => {
    if (!user) return;
    
    try {
      // Add to applications
      setApplications(prev => [...prev, jobId]);
      
      // In production, this would save to Supabase applications table
      // const { error } = await supabase
      //   .from('applications')
      //   .insert({
      //     user_id: user.id,
      //     job_id: jobId,
      //     status: 'applied',
      //     applied_at: new Date().toISOString()
      //   });
      
      nextJob();
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