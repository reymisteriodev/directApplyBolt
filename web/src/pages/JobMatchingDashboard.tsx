import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Heart, 
  MessageSquare, 
  Filter,
  Building2,
  Star,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Users,
  Globe,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  company: string;
  industry: string;
  logo: string;
  location: string;
  salary: string;
  experience: string;
  workStyle: 'Remote' | 'Onsite' | 'Hybrid';
  jobType: 'Full-time' | 'Part-time' | 'Contract';
  matchScore: number;
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  isLiked: boolean;
  postedDate: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  jobId?: string;
}

const JobMatchingDashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    workStyle: ''
  });
  
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      industry: 'Technology',
      logo: '🚀',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      experience: '5+ years',
      workStyle: 'Remote',
      jobType: 'Full-time',
      matchScore: 92,
      tags: ['H1B Sponsor Likely', 'Growth Opportunities', 'Stock Options'],
      description: 'Join our innovative team building next-generation web applications...',
      requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      benefits: ['Health Insurance', 'Remote Work', '401k Match'],
      isLiked: false,
      postedDate: '2 days ago'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      industry: 'Fintech',
      logo: '💳',
      location: 'New York, NY',
      salary: '$100k - $130k',
      experience: '3+ years',
      workStyle: 'Hybrid',
      jobType: 'Full-time',
      matchScore: 78,
      tags: ['Fast Growth', 'Equity Package'],
      description: 'Drive product strategy for our consumer-facing applications...',
      requirements: ['Product Strategy', 'Analytics', 'User Research'],
      benefits: ['Equity', 'Flexible Hours', 'Learning Budget'],
      isLiked: true,
      postedDate: '1 day ago'
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Design Studio Pro',
      industry: 'Design',
      logo: '🎨',
      location: 'Austin, TX',
      salary: '$80k - $110k',
      experience: '4+ years',
      workStyle: 'Remote',
      jobType: 'Full-time',
      matchScore: 85,
      tags: ['Creative Freedom', 'Portfolio Building'],
      description: 'Create beautiful, intuitive user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      benefits: ['Creative Freedom', 'Conference Budget', 'Remote Work'],
      isLiked: false,
      postedDate: '3 days ago'
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'CloudTech Solutions',
      industry: 'Cloud Computing',
      logo: '☁️',
      location: 'Seattle, WA',
      salary: '$110k - $140k',
      experience: '4+ years',
      workStyle: 'Onsite',
      jobType: 'Full-time',
      matchScore: 67,
      tags: ['H1B Sponsor', 'Mentorship Program'],
      description: 'Build scalable backend services using cutting-edge technology...',
      requirements: ['Python', 'AWS', 'Kubernetes', 'Microservices'],
      benefits: ['Health Insurance', 'Mentorship', 'Tech Talks'],
      isLiked: false,
      postedDate: '5 days ago'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome back, Alex! 👋 I\'ve found 4 new job matches for you today. Your profile strength has improved by 15% this week!',
      timestamp: new Date()
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    {
      icon: Target,
      text: 'Fine-tune my job search criteria',
      action: () => handleSuggestedAction('Fine-tune my job search criteria')
    },
    {
      icon: Star,
      text: 'Show me my Top Match jobs',
      action: () => handleSuggestedAction('Show me my Top Match jobs')
    },
    {
      icon: TrendingUp,
      text: 'Why is my match score low for Backend Engineer?',
      action: () => handleSuggestedAction('Why is my match score low for Backend Engineer?')
    },
    {
      icon: Award,
      text: 'How can I improve my profile?',
      action: () => handleSuggestedAction('How can I improve my profile?')
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'from-green-400 to-green-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-orange-400 to-orange-600';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 85) return 'TOP MATCH';
    if (score >= 70) return 'GOOD MATCH';
    return 'FAIR MATCH';
  };

  const handleLikeJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isLiked: !job.isLiked } : job
    ));
  };

  const handleAskCopilot = (job: Job) => {
    setActiveJobId(job.id);
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I can help you with the ${job.title} position at ${job.company}! Here's what I found:\n\n🎯 **Match Analysis**: You have a ${job.matchScore}% match\n📋 **Key Requirements**: ${job.requirements.join(', ')}\n💡 **Why this role fits**: Your React and TypeScript experience aligns perfectly with their tech stack.\n\nWhat specific questions do you have about this role?`,
      timestamp: new Date(),
      jobId: job.id
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleSuggestedAction = (action: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: action,
      timestamp: new Date()
    };

    let assistantResponse = '';
    
    switch (action) {
      case 'Fine-tune my job search criteria':
        assistantResponse = 'Let\'s optimize your search! Based on your profile, I recommend:\n\n🎯 Focus on Senior Frontend roles (92% avg match)\n📍 Remote positions increase your options by 40%\n💰 Target $120k-$150k range for your experience\n🏢 Tech companies value your React expertise most\n\nWould you like me to update your preferences?';
        break;
      case 'Show me my Top Match jobs':
        assistantResponse = 'Here are your highest-scoring opportunities:\n\n🥇 Senior Frontend Developer at TechCorp (92% match)\n🥈 UX Designer at Design Studio Pro (85% match)\n🥉 Product Manager at StartupXYZ (78% match)\n\nThe top match aligns perfectly with your React and TypeScript skills!';
        break;
      case 'Why is my match score low for Backend Engineer?':
        assistantResponse = 'Great question! Your 67% match for the Backend Engineer role is lower because:\n\n❌ Missing: Python experience (required)\n❌ Limited: AWS/Cloud experience\n❌ Gap: Microservices architecture\n\n✅ Strengths: Strong programming fundamentals\n✅ Plus: Problem-solving skills transfer well\n\n💡 Recommendation: Consider taking a Python course to boost this score to 80%+';
        break;
      case 'How can I improve my profile?':
        assistantResponse = 'Your profile is strong! Here\'s how to make it even better:\n\n📈 **Quick Wins**:\n• Add 2-3 recent projects with metrics\n• Include certifications (AWS, React)\n• Update skills with proficiency levels\n\n🚀 **Impact**: These changes could increase your average match score from 80% to 90%+\n\nShall I help you prioritize these improvements?';
        break;
      default:
        assistantResponse = 'I\'m here to help with your job search! Feel free to ask me anything about the roles, companies, or how to improve your applications.';
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    // Simulate AI response
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `I understand you're asking about "${chatInput}". Based on your profile and current job market trends, here's my analysis...\n\n🎯 This relates to your job search goals\n📊 Your current match scores suggest focusing on frontend roles\n💡 I recommend prioritizing applications to companies that value your React expertise\n\nWould you like me to elaborate on any specific aspect?`,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage, assistantMessage]);
    setChatInput('');
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.workStyle && job.workStyle !== filters.workStyle) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Feed - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Recommendations</h1>
                <p className="text-gray-600 mt-1">Powered by AI • {filteredJobs.length} matches found</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Matching</span>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">Filters</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    <option value="San Francisco">San Francisco, CA</option>
                    <option value="New York">New York, NY</option>
                    <option value="Austin">Austin, TX</option>
                    <option value="Seattle">Seattle, WA</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
                  <select
                    value={filters.workStyle}
                    onChange={(e) => setFilters({...filters, workStyle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Styles</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-2xl">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.industry}</p>
                      </div>
                    </div>
                    
                    {/* Match Score */}
                    <div className="text-center">
                      <div className={`w-20 h-20 bg-gradient-to-br ${getMatchScoreColor(job.matchScore)} rounded-full flex flex-col items-center justify-center text-white shadow-lg`}>
                        <span className="text-lg font-bold">{job.matchScore}%</span>
                        <span className="text-xs font-medium">{getMatchScoreLabel(job.matchScore)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{job.workStyle}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-2">{job.description}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLikeJob(job.id)}
                        className={`p-3 rounded-full border-2 transition-all duration-200 ${
                          job.isLiked 
                            ? 'border-red-300 bg-red-50 text-red-600' 
                            : 'border-gray-300 bg-white text-gray-400 hover:border-red-300 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${job.isLiked ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => handleAskCopilot(job)}
                        className="flex items-center space-x-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Ask Copilot</span>
                      </button>
                    </div>
                    
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl">
                      <span>APPLY NOW</span>
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Copilot - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-8 h-[calc(100vh-6rem)] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Copilot</h3>
                    <p className="text-sm text-gray-600">Your job search assistant</p>
                  </div>
                </div>
                
                {/* Suggested Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
                  {suggestedActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors text-sm"
                    >
                      <action.icon className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatchingDashboard;