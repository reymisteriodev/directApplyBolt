import React, { useState } from 'react';
import { Eye, Clock, CheckCircle, X, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import VerificationBadge from '../components/VerificationBadge';

const ApplicationTracker: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const applications = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      appliedDate: '2024-01-20',
      status: 'in-review',
      isVerified: true,
      timeline: [
        { stage: 'applied', completed: true, date: '2024-01-20' },
        { stage: 'viewed', completed: true, date: '2024-01-21' },
        { stage: 'in-review', completed: true, date: '2024-01-22' },
        { stage: 'interview', completed: false, date: null },
        { stage: 'decision', completed: false, date: null }
      ],
      responseDeadline: '2024-02-10'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      appliedDate: '2024-01-18',
      status: 'viewed',
      isVerified: false,
      timeline: [
        { stage: 'applied', completed: true, date: '2024-01-18' },
        { stage: 'viewed', completed: true, date: '2024-01-19' },
        { stage: 'in-review', completed: false, date: null },
        { stage: 'interview', completed: false, date: null },
        { stage: 'decision', completed: false, date: null }
      ],
      responseDeadline: null
    },
    {
      id: '3',
      jobTitle: 'UX Designer',
      company: 'Design Studio Pro',
      appliedDate: '2024-01-15',
      status: 'interview',
      isVerified: true,
      timeline: [
        { stage: 'applied', completed: true, date: '2024-01-15' },
        { stage: 'viewed', completed: true, date: '2024-01-16' },
        { stage: 'in-review', completed: true, date: '2024-01-17' },
        { stage: 'interview', completed: true, date: '2024-01-22' },
        { stage: 'decision', completed: false, date: null }
      ],
      responseDeadline: '2024-02-05'
    },
    {
      id: '4',
      jobTitle: 'Backend Engineer',
      company: 'CloudTech Solutions',
      appliedDate: '2024-01-10',
      status: 'rejected',
      isVerified: true,
      timeline: [
        { stage: 'applied', completed: true, date: '2024-01-10' },
        { stage: 'viewed', completed: true, date: '2024-01-11' },
        { stage: 'in-review', completed: true, date: '2024-01-12' },
        { stage: 'interview', completed: false, date: null },
        { stage: 'decision', completed: true, date: '2024-01-15' }
      ],
      responseDeadline: '2024-01-31'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-orange-100 text-orange-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offered': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'viewed': return <Eye className="w-4 h-4" />;
      case 'in-review': return <Clock className="w-4 h-4" />;
      case 'interview': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'offered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimelineStageLabel = (stage: string) => {
    switch (stage) {
      case 'applied': return 'Applied';
      case 'viewed': return 'Viewed';
      case 'in-review': return 'In Review';
      case 'interview': return 'Interview';
      case 'decision': return 'Decision';
      default: return stage;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Tracker</h1>
          <p className="text-gray-600">Track the status of all your job applications in one place</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applications', value: applications.length, color: 'bg-orange-100 text-orange-600' },
            { label: 'In Review', value: applications.filter(app => app.status === 'in-review').length, color: 'bg-purple-100 text-purple-600' },
            { label: 'Interviews', value: applications.filter(app => app.status === 'interview').length, color: 'bg-green-100 text-green-600' },
            { label: 'Response Rate', value: '75%', color: 'bg-blue-100 text-blue-600' }
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

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
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
                  <option value="all">All Applications</option>
                  <option value="applied">Applied</option>
                  <option value="viewed">Viewed</option>
                  <option value="in-review">In Review</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="offered">Offered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                    <VerificationBadge isVerified={application.isVerified} size="sm" />
                  </div>
                  <p className="text-gray-600">{application.company}</p>
                  <p className="text-sm text-gray-500">Applied on {application.appliedDate}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{application.status.replace('-', ' ')}</span>
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Application Progress</h4>
                <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                  {application.timeline.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.completed 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stage.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-medium ${
                          stage.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {getTimelineStageLabel(stage.stage)}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-500">{stage.date}</p>
                        )}
                      </div>
                      {index < application.timeline.length - 1 && (
                        <div className={`w-8 h-0.5 ${
                          stage.completed ? 'bg-orange-300' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Deadline */}
              {application.isVerified && application.responseDeadline && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">
                      <strong>Guaranteed Response by:</strong> {application.responseDeadline}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;