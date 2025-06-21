import React, { useState } from 'react';
import { Plus, Users, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import VerificationBadge from '../components/VerificationBadge';

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    { label: 'Active Jobs', value: '8', icon: Users, color: 'bg-orange-100 text-orange-600' },
    { label: 'Total Applications', value: '124', icon: Eye, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Reviews', value: '23', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Verified Jobs', value: '5', icon: CheckCircle, color: 'bg-purple-100 text-purple-600' }
  ];

  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      postedDate: '2024-01-15',
      applicants: 45,
      status: 'active',
      isVerified: true,
      deadline: '2024-02-05',
      responseRate: 100
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      postedDate: '2024-01-20',
      applicants: 28,
      status: 'active',
      isVerified: false,
      deadline: null,
      responseRate: 85
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      postedDate: '2024-01-10',
      applicants: 67,
      status: 'paused',
      isVerified: true,
      deadline: '2024-01-31',
      responseRate: 100
    }
  ];

  const recentApplications = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      applicantName: 'Alex Johnson',
      appliedDate: '2024-01-22',
      matchScore: 92,
      status: 'pending'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      applicantName: 'Sarah Chen',
      appliedDate: '2024-01-22',
      matchScore: 78,
      status: 'reviewed'
    },
    {
      id: '3',
      jobTitle: 'UX Designer',
      applicantName: 'Marcus Williams',
      appliedDate: '2024-01-21',
      matchScore: 85,
      status: 'interviewed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-orange-100 text-orange-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="company" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
          </div>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'jobs', label: 'Job Postings' },
                { id: 'applications', label: 'Applications' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{application.applicantName}</h4>
                          <p className="text-sm text-gray-600">{application.jobTitle}</p>
                          <p className="text-xs text-gray-500">Applied {application.appliedDate}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-orange-600">{application.matchScore}%</div>
                            <div className="text-xs text-gray-500">Match</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Reminder */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Verify Your Job Postings</h3>
                      <p className="text-orange-700 mt-1">
                        Verified jobs get 3x more quality applications. Stake a small deposit to guarantee 
                        responses and boost your visibility.
                      </p>
                      <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                        Verify Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Job Postings</h3>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                    Post New Job
                  </button>
                </div>
                
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                            <VerificationBadge isVerified={job.isVerified} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-gray-600">{job.department} • Posted {job.postedDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                            View
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Applicants</span>
                          <p className="font-medium text-gray-900">{job.applicants}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Response Rate</span>
                          <p className="font-medium text-gray-900">{job.responseRate}%</p>
                        </div>
                        {job.isVerified && job.deadline && (
                          <div>
                            <span className="text-gray-500">Response Deadline</span>
                            <p className="font-medium text-gray-900">{job.deadline}</p>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors">
                            Manage Applicants
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">All Applications</h3>
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Application management interface would go here</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h3>
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics dashboard would go here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;