import React, { useState, useEffect } from 'react';
import { Upload, User, FileText, Award, Settings, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    professionalSummary: ''
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      // Get user metadata from auth
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      const email = user.email || '';

      // Try to get additional profile data from CV
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('cv_data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      let phone = '';
      let location = '';
      let professionalSummary = '';

      if (!error && profileData && profileData.length > 0 && profileData[0]?.cv_data) {
        const cvData = profileData[0].cv_data;
        phone = cvData.personalInfo?.phone || '';
        location = cvData.personalInfo?.location || '';
        professionalSummary = cvData.professionalSummary || '';
      }

      setProfileData({
        firstName,
        lastName,
        email,
        phone,
        location,
        professionalSummary
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error('Please sign in to save profile');
      return;
    }

    setLoading(true);
    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName
        }
      });

      if (authError) {
        console.error('Error updating auth metadata:', authError);
        // Continue anyway, as this is not critical
      }

      // Update or create user profile with CV data
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      const cvData = existingProfile?.[0]?.cv_data || {};
      
      // Update CV data with new profile information
      const updatedCvData = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location
        },
        professionalSummary: profileData.professionalSummary
      };

      if (existingProfile && existingProfile.length > 0) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            cv_data: updatedCvData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile[0].id);

        if (updateError) throw updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            cv_data: updatedCvData,
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserName = () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    if (fullName) {
      return fullName;
    }
    if (profileData.email) {
      return profileData.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{getCurrentUserName()}</h2>
              <p className="text-gray-600">{profileData.email}</p>
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
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support if needed.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
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
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        placeholder="City, State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Summary
                      </label>
                      <textarea
                        name="professionalSummary"
                        value={profileData.professionalSummary}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Brief description of your professional background and career goals..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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