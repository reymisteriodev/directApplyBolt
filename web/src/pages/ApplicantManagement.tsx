import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, CheckCircle, X, Filter, Search, Download, Eye } from 'lucide-react';
import Header from '../components/Header';

const ApplicantManagement: React.FC = () => {
  const { jobId } = useParams();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match-score');

  // Mock data
  const jobDetails = {
    id: jobId,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    postedDate: '2024-01-15',
    isVerified: true,
    responseDeadline: '2024-02-05',
    daysLeft: 14
  };

  const applicants = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      appliedDate: '2024-01-22',
      matchScore: 92,
      status: 'pending',
      experience: '5 years',
      location: 'San Francisco, CA',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      resumeUrl: '#'
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      appliedDate: '2024-01-21',
      matchScore: 88,
      status: 'reviewed',
      experience: '7 years',
      location: 'New York, NY',
      skills: ['Vue.js', 'JavaScript', 'Python', 'AWS'],
      resumeUrl: '#'
    },
    {
      id: '3',
      name: 'Marcus Williams',
      email: 'marcus.williams@email.com',
      appliedDate: '2024-01-20',
      matchScore: 85,
      status: 'interviewed',
      experience: '4 years',
      location: 'Austin, TX',
      skills: ['React', 'JavaScript', 'MongoDB', 'Express'],
      resumeUrl: '#'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      appliedDate: '2024-01-19',
      matchScore: 78,
      status: 'pending',
      experience: '3 years',
      location: 'Seattle, WA',
      skills: ['Angular', 'TypeScript', 'Firebase', 'Docker'],
      resumeUrl: '#'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-orange-100 text-orange-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (applicantId: string, newStatus: string) => {
    console.log(`Changing status for applicant ${applicantId} to ${newStatus}`);
    // Handle status change logic
  };

  const filteredApplicants = applicants
    .filter(applicant => {
      const matchesFilter = filter === 'all' || applicant.status === filter;
      const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'match-score':
          return b.matchScore - a.matchScore;
        case 'applied-date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="company" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{jobDetails.title}</h1>
              <p className="text-gray-600 mt-1">{jobDetails.department} • Posted {jobDetails.postedDate}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                Edit Job
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                View Job Posting
              </button>
            </div>
          </div>
        </div>

        {/* Response Deadline Alert */}
        {jobDetails.isVerified && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Response Deadline</h3>
                <p className="text-orange-700 text-sm">
                  You have <strong>{jobDetails.daysLeft} days</strong> left to respond to all applicants 
                  (by {jobDetails.responseDeadline}) to maintain your verification status.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applicants', value: applicants.length, color: 'bg-orange-100 text-orange-600' },
            { label: 'Pending Review', value: applicants.filter(a => a.status === 'pending').length, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Interviewed', value: applicants.filter(a => a.status === 'interviewed').length, color: 'bg-purple-100 text-purple-600' },
            { label: 'Avg Match Score', value: Math.round(applicants.reduce((sum, a) => sum + a.matchScore, 0) / applicants.length) + '%', color: 'bg-green-100 text-green-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <div className="w-6 h-6"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="advanced">Advanced</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="match-score">Sort by Match Score</option>
                <option value="applied-date">Sort by Applied Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <div key={applicant.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-lg">
                        {applicant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                      <p className="text-gray-600">{applicant.email}</p>
                      <p className="text-sm text-gray-500">{applicant.location} • {applicant.experience} experience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                      <span className="font-semibold text-gray-900">{applicant.matchScore}% Match</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                      {applicant.status}
                    </span>
                    <span className="text-sm text-gray-500">Applied {applicant.appliedDate}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </button>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleStatusChange(applicant.id, 'advanced')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      Advance
                    </button>
                    <button
                      onClick={() => handleStatusChange(applicant.id, 'declined')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantManagement;