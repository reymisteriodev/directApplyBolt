import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Briefcase } from 'lucide-react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import VerificationBadge from '../components/VerificationBadge';

const JobSeekerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    remote: false,
    verifiedOnly: false
  });

  // Mock job data
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      postedDate: '2 days ago',
      isVerified: true,
      matchScore: 92,
      remote: true,
      description: 'We are looking for a senior frontend developer to join our growing team. You will be responsible for building scalable web applications using React and TypeScript.'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$100k - $130k',
      postedDate: '1 day ago',
      isVerified: false,
      matchScore: 78,
      remote: false,
      description: 'Join our product team to drive the vision and strategy for our consumer-facing applications. Experience with B2C products required.'
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Design Studio Pro',
      location: 'Austin, TX',
      salary: '$80k - $110k',
      postedDate: '3 days ago',
      isVerified: true,
      matchScore: 85,
      remote: true,
      description: 'We need a creative UX designer to help us create intuitive and beautiful user experiences for our client projects.'
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      salary: '$110k - $140k',
      postedDate: '5 days ago',
      isVerified: true,
      matchScore: 88,
      remote: false,
      description: 'Build and maintain scalable backend services using Node.js, Python, and cloud technologies. Strong API design experience required.'
    }
  ];

  const handleApply = (jobId: string) => {
    console.log('Applying to job:', jobId);
    // Handle job application logic
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const stats = [
    { label: 'Applications Sent', value: '12', icon: Briefcase },
    { label: 'Profile Views', value: '45', icon: Star },
    { label: 'Responses Received', value: '8', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for jobs, companies, or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span>Remote Only</span>
              </label>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span>Verified Jobs Only</span>
              </label>
            </div>
          </form>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>{jobs.length} jobs found</span>
            </div>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showMatchScore={true}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-colors font-medium">
            Load More Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;