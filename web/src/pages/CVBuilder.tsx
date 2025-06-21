import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Eye,
  CheckCircle,
  ArrowRight,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    githubUrl: string;
  };
  professionalSummary: string;
  employmentHistory: Array<{
    id: string;
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    graduationDate: string;
  }>;
}

const CVBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasCompletedCV, setHasCompletedCV } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isNewCV, setIsNewCV] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cvId, setCvId] = useState<string | null>(null);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: user?.email || '',
      phone: '',
      linkedinUrl: '',
      githubUrl: ''
    },
    professionalSummary: '',
    employmentHistory: [],
    education: []
  });

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Professional Summary', icon: FileText },
    { number: 3, title: 'Employment History', icon: Briefcase },
    { number: 4, title: 'Education', icon: GraduationCap },
    { number: 5, title: 'Review & Analyze', icon: Eye }
  ];

  // Check if user is creating a new CV or first-time setup
  useEffect(() => {
    if (hasCompletedCV) {
      setIsNewCV(true);
      setShowCancelButton(true);
    }

    // Check if we're in edit mode
    if (location.state?.editMode && location.state?.cvData) {
      setEditMode(true);
      setCvData(location.state.cvData);
      setCvId(location.state.cvId);
      setShowCancelButton(true);
    }
  }, [hasCompletedCV, location.state]);

  // Load existing CV data if available and not in edit mode
  useEffect(() => {
    const loadExistingCV = async () => {
      if (!user || !hasCompletedCV || editMode) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('cv_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0 && data[0]?.cv_data) {
          setCvData(data[0].cv_data);
        }
      } catch (error) {
        console.error('Error loading CV data:', error);
      }
    };

    loadExistingCV();
  }, [user, hasCompletedCV, editMode]);

  const addEmployment = () => {
    setCvData({
      ...cvData,
      employmentHistory: [
        ...cvData.employmentHistory,
        {
          id: Date.now().toString(),
          company: '',
          jobTitle: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    });
  };

  const updateEmployment = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      employmentHistory: cvData.employmentHistory.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    });
  };

  const removeEmployment = (id: string) => {
    setCvData({
      ...cvData,
      employmentHistory: cvData.employmentHistory.filter(emp => emp.id !== id)
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          graduationDate: ''
        }
      ]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id)
    });
  };

  const generateAISummary = async () => {
    if (cvData.employmentHistory.length === 0) {
      toast.error('Please add at least one work experience first');
      return;
    }

    setIsGeneratingSummary(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const workExperience = cvData.employmentHistory.map(emp => 
        `${emp.jobTitle} at ${emp.company}`
      ).join(', ');
      
      const generatedSummary = `Experienced professional with a proven track record in ${workExperience}. Demonstrated expertise in driving results, leading cross-functional teams, and delivering innovative solutions. Passionate about leveraging technology to solve complex business challenges and create meaningful impact.`;
      
      setCvData({
        ...cvData,
        professionalSummary: generatedSummary
      });
      
      setIsGeneratingSummary(false);
      toast.success('AI summary generated successfully!');
    }, 2000);
  };

  const handleCancel = async () => {
    // Save as draft if there's meaningful content
    const hasContent = cvData.personalInfo.fullName || 
                      cvData.personalInfo.email || 
                      cvData.professionalSummary ||
                      cvData.employmentHistory.length > 0 ||
                      cvData.education.length > 0;

    if (hasContent && !editMode) {
      try {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user?.id,
            cv_data: cvData,
            updated_at: new Date().toISOString()
          });
        
        toast.success('Progress saved as draft');
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }

    // Navigate back to appropriate location
    if (editMode) {
      navigate('/seeker/cv-analysis-hub');
    } else if (hasCompletedCV) {
      navigate('/seeker/cv-analysis-hub');
    } else {
      navigate('/seeker/cv-welcome');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!cvData.personalInfo.fullName || !cvData.personalInfo.email) {
        toast.error('Please fill in your name and email');
        return;
      }

      // Save CV data to Supabase
      if (editMode && cvId) {
        // Update existing CV
        const { error } = await supabase
          .from('user_profiles')
          .update({
            cv_data: cvData,
            updated_at: new Date().toISOString()
          })
          .eq('id', cvId);

        if (error) throw error;
      } else {
        // Create new CV
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user?.id,
            cv_data: cvData,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Update CV completion status
      setHasCompletedCV(true);

      if (editMode) {
        toast.success('CV updated successfully!');
        navigate('/seeker/cv-analysis', { 
          state: { 
            cvData,
            fromDashboard: true 
          } 
        });
      } else if (isNewCV) {
        toast.success('CV updated successfully! Let\'s analyze it to make it even better.');
        navigate('/seeker/cv-analysis', { 
          state: { 
            cvData,
            fromDashboard: true 
          } 
        });
      } else {
        toast.success('CV created successfully! Let\'s analyze it to make it even better.');
        navigate('/seeker/cv-analysis', { state: { cvData } });
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message for New Users */}
        {!isNewCV && !editMode && (
          <motion.div 
            className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-900">Let's Build Your Professional CV</h2>
                <p className="text-orange-700">This guided process will help you create a standout CV that gets noticed by employers.</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              {/* Progress Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {showCancelButton && (
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {editMode ? 'Edit Your CV' : (isNewCV ? 'Create New CV' : 'Build Your CV')}
                      </h1>
                      <p className="text-gray-600">Step {currentStep} of 5</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-orange-600 font-medium">AI-Powered</span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-medium ${
                          currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 ${
                          currentStep > step.number ? 'bg-orange-300' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={cvData.personalInfo.fullName}
                              onChange={(e) => setCvData({
                                ...cvData,
                                personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={cvData.personalInfo.email}
                              onChange={(e) => setCvData({
                                ...cvData,
                                personalInfo: { ...cvData.personalInfo, email: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="john@example.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={cvData.personalInfo.phone}
                              onChange={(e) => setCvData({
                                ...cvData,
                                personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              LinkedIn URL
                            </label>
                            <input
                              type="url"
                              value={cvData.personalInfo.linkedinUrl}
                              onChange={(e) => setCvData({
                                ...cvData,
                                personalInfo: { ...cvData.personalInfo, linkedinUrl: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="https://linkedin.com/in/johndoe"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GitHub URL
                            </label>
                            <input
                              type="url"
                              value={cvData.personalInfo.githubUrl}
                              onChange={(e) => setCvData({
                                ...cvData,
                                personalInfo: { ...cvData.personalInfo, githubUrl: e.target.value }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="https://github.com/johndoe"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Professional Summary */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                          <button
                            onClick={generateAISummary}
                            disabled={isGeneratingSummary}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>{isGeneratingSummary ? 'Generating...' : 'AI Suggestion'}</span>
                          </button>
                        </div>
                        
                        <textarea
                          value={cvData.professionalSummary}
                          onChange={(e) => setCvData({
                            ...cvData,
                            professionalSummary: e.target.value
                          })}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
                        />
                        
                        <p className="text-sm text-gray-500 mt-2">
                          Tip: A good summary is 2-3 sentences highlighting your experience and value proposition.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Employment History */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Employment History</h3>
                        <button
                          onClick={addEmployment}
                          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Experience</span>
                        </button>
                      </div>

                      {cvData.employmentHistory.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No work experience added yet</p>
                          <button
                            onClick={addEmployment}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Add Your First Job
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cvData.employmentHistory.map((employment, index) => (
                            <div key={employment.id} className="p-6 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                                <button
                                  onClick={() => removeEmployment(employment.id)}
                                  className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Remove</span>
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={employment.company}
                                    onChange={(e) => updateEmployment(employment.id, 'company', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Company Name"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title *
                                  </label>
                                  <input
                                    type="text"
                                    value={employment.jobTitle}
                                    onChange={(e) => updateEmployment(employment.id, 'jobTitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Job Title"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                  </label>
                                  <input
                                    type="month"
                                    value={employment.startDate}
                                    onChange={(e) => updateEmployment(employment.id, 'startDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                  </label>
                                  <input
                                    type="month"
                                    value={employment.endDate}
                                    onChange={(e) => updateEmployment(employment.id, 'endDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Leave blank if current"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Description & Achievements *
                                </label>
                                <textarea
                                  value={employment.description}
                                  onChange={(e) => updateEmployment(employment.id, 'description', e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder="Describe your responsibilities, achievements, and impact in this role..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Education */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                        <button
                          onClick={addEducation}
                          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Education</span>
                        </button>
                      </div>

                      {cvData.education.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No education added yet</p>
                          <button
                            onClick={addEducation}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Add Education
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cvData.education.map((education, index) => (
                            <div key={education.id} className="p-6 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                                <button
                                  onClick={() => removeEducation(education.id)}
                                  className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Remove</span>
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institution *
                                  </label>
                                  <input
                                    type="text"
                                    value={education.institution}
                                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="University Name"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree *
                                  </label>
                                  <input
                                    type="text"
                                    value={education.degree}
                                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Bachelor of Science in Computer Science"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Graduation Date *
                                  </label>
                                  <input
                                    type="month"
                                    value={education.graduationDate}
                                    onChange={(e) => updateEducation(education.id, 'graduationDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 5: Review */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your CV</h3>
                        <p className="text-gray-600 mb-6">
                          Please review your information before proceeding to AI analysis.
                        </p>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 text-center">
                          <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-gray-900 mb-2">Ready for AI Analysis</h4>
                          <p className="text-gray-600 mb-6">
                            Our AI will analyze your CV and provide detailed feedback to help you improve your job application success rate.
                          </p>
                          
                          <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold flex items-center space-x-2 mx-auto shadow-lg"
                          >
                            <span>{editMode ? 'Update & Analyze CV' : (isNewCV ? 'Create & Analyze CV' : 'Analyze My CV')}</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  {currentStep < 5 && (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Live Preview</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {/* Personal Info Preview */}
                <div>
                  <h4 className="font-bold text-lg text-gray-900">
                    {cvData.personalInfo.fullName || 'Your Name'}
                  </h4>
                  {cvData.personalInfo.email && (
                    <p className="text-gray-600">{cvData.personalInfo.email}</p>
                  )}
                  {cvData.personalInfo.phone && (
                    <p className="text-gray-600">{cvData.personalInfo.phone}</p>
                  )}
                </div>

                {/* Summary Preview */}
                {cvData.professionalSummary && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Professional Summary</h5>
                    <p className="text-sm text-gray-600">{cvData.professionalSummary}</p>
                  </div>
                )}

                {/* Employment Preview */}
                {cvData.employmentHistory.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Experience</h5>
                    <div className="space-y-3">
                      {cvData.employmentHistory.map((emp) => (
                        <div key={emp.id} className="text-sm">
                          <p className="font-medium text-gray-900">{emp.jobTitle}</p>
                          <p className="text-gray-600">{emp.company}</p>
                          <p className="text-gray-500 text-xs">
                            {emp.startDate} - {emp.endDate || 'Present'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Preview */}
                {cvData.education.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Education</h5>
                    <div className="space-y-3">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="text-sm">
                          <p className="font-medium text-gray-900">{edu.degree}</p>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-gray-500 text-xs">{edu.graduationDate}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;