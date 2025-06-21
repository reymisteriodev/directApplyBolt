import React, { useState } from 'react';
import { Upload, User, FileText, Award, Settings } from 'lucide-react';
import Header from '../components/Header';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600">Frontend Developer</p>
            </div>
            
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile Info', icon: User },
                { id: 'cv', label: 'CV Management', icon: FileText },
                { id: 'skills', label: 'Skills & Experience', icon: Award },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="City, State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Brief description of your professional background and career goals..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">CV Management</h3>
                  
                  {/* CV Upload */}
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your CV</h4>
                      <p className="text-gray-600 mb-4">Drag and drop your CV here, or click to browse</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer inline-block"
                      >
                        Choose File
                      </label>
                      {cvFile && (
                        <p className="mt-2 text-sm text-gray-600">Selected: {cvFile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* CV Analysis */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-orange-900 mb-3">AI CV Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-800">Overall Score</span>
                        <span className="font-bold text-orange-900">85/100</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h5 className="font-medium text-orange-900">Key Skills Identified:</h5>
                      <div className="flex flex-wrap gap-2">
                        {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                          <span key={skill} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-orange-900 mb-2">Improvement Suggestions:</h5>
                      <ul className="text-orange-800 text-sm space-y-1">
                        <li>• Add more quantified achievements</li>
                        <li>• Include relevant certifications</li>
                        <li>• Optimize keywords for your target roles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills & Experience</h3>
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Skills management interface would go here</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Settings interface would go here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;