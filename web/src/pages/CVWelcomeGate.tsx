import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CVWelcomeGate: React.FC = () => {
  const navigate = useNavigate();
  const { user, setHasCompletedCV, loading } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const parseFileContent = async (file: File): Promise<any> => {
    try {
      // Create FormData to send file to edge function
      const formData = new FormData();
      formData.append('file', file);

      // Get the Supabase URL and key from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing. Please check your environment variables.');
      }

      // Call the edge function to parse the CV
      const response = await fetch(`${supabaseUrl}/functions/v1/parse-cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to parse CV`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error parsing file:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to extract text from file');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Wait for auth to load if it's still loading
    if (loading) {
      toast.error('Please wait for authentication to complete');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error('Authentication required. Please sign in to continue.');
      navigate('/seeker/login');
      return;
    }

    setIsUploading(true);

    try {
      // Parse the file using the edge function
      let parsedData;
      try {
        parsedData = await parseFileContent(file);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        // If parsing fails, create a basic CV structure with the file
        parsedData = {
          extractedText: 'CV content could not be automatically extracted. Please review and edit your information.',
          personalInfo: {
            name: user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
            email: user?.email || '',
            phone: ''
          },
          sections: {
            summary: '',
            experience: '',
            education: '',
            skills: ''
          }
        };
      }
      
      // Ensure we have some extracted text
      if (!parsedData.extractedText || parsedData.extractedText.trim().length < 10) {
        parsedData.extractedText = 'CV uploaded successfully. Please review and edit your information in the CV builder.';
      }

      // Upload file to Supabase storage
      let uploadData = null;
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/cv_${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('cv-files')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          // Continue without file storage if it fails
        } else {
          uploadData = data;
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        // Continue without file storage if it fails
      }

      // Save CV upload record to database with extracted text
      const cvData = {
        personalInfo: {
          fullName: parsedData.personalInfo?.name || user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name || '',
          email: parsedData.personalInfo?.email || user?.email || '',
          phone: parsedData.personalInfo?.phone || '',
          linkedinUrl: '',
          githubUrl: ''
        },
        professionalSummary: parsedData.sections?.summary || '',
        employmentHistory: Array.isArray(parsedData.sections?.experience) ? parsedData.sections.experience : [],
        education: Array.isArray(parsedData.sections?.education) ? parsedData.sections.education : [],
        skills: parsedData.sections?.skills || [],
        uploadedFile: {
          fileName: file.name,
          filePath: uploadData?.path || '',
          uploadedAt: new Date().toISOString(),
          extractedText: parsedData.extractedText,
          fileSize: file.size,
          fileType: file.type,
          parsedData: parsedData
        }
      };

      // Try to save to database
      try {
        // First check if user profile exists - use maybeSingle() instead of single()
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              cv_data: cvData,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          // Create new profile
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              cv_data: cvData,
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }

        setHasCompletedCV(true);
        toast.success('CV uploaded and processed successfully!');
        navigate('/seeker/cv-analysis', { 
          state: { 
            cvData,
            fromWelcome: true 
          } 
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        toast.error('CV uploaded but failed to save to database. Please try again or contact support.');
      }

    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process CV. Please try again or create a new CV.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCreateCV = () => {
    // Check authentication before navigating to CV builder
    if (loading) {
      toast.error('Please wait for authentication to complete');
      return;
    }

    if (!user) {
      toast.error('Authentication required. Please sign in to continue.');
      navigate('/seeker/login');
      return;
    }

    navigate('/seeker/cv-builder');
  };

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Full-screen immersive layout */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div 
          className="max-w-4xl w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Welcome Header */}
          <div className="text-center mb-16">
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                DirectApply
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              To unlock AI-powered job matching and personalized recommendations, we need your CV first.
            </motion.p>
            
            <motion.div
              className="mt-8 inline-flex items-center bg-orange-100 border border-orange-200 text-orange-800 px-6 py-3 rounded-full text-lg font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Do you have a CV ready?
            </motion.div>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Upload CV Option */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-10 text-center hover:border-orange-300 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Yes, Upload My CV</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Upload your existing CV (PDF or Word) and our AI will instantly extract and analyze your information to create a powerful profile.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Drag and Drop Area */}
                    <div
                      className={`border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        dragActive 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="cv-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="cv-upload"
                        className={`block cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-blue-600 font-medium">Processing your CV...</span>
                            <span className="text-sm text-gray-500">Extracting text and analyzing content</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-4">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="text-lg font-medium text-gray-700">
                                Drag & drop your CV here
                              </p>
                              <p className="text-gray-500">or click to browse</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                    
                    <button
                      onClick={() => document.getElementById('cv-upload')?.click()}
                      disabled={isUploading}
                      className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <Upload className="w-5 h-5" />
                          <span>Choose File to Upload</span>
                        </div>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>PDF Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Word Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Max 5MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Create CV Option */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div 
                onClick={handleCreateCV}
                className="bg-white rounded-3xl border-2 border-gray-200 p-10 text-center hover:border-orange-300 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <FileText className="w-10 h-10 text-orange-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">No, Create One Now</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Don't have a CV? No problem! Our AI-powered guided builder will help you create a professional CV in just minutes.
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105">
                    <span>Start Building</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>5 Minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Professional</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div 
            className="bg-white rounded-3xl border border-gray-200 p-10 shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why we need your CV to unlock the full DirectApply experience:
            </h4>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="flex flex-col items-center space-y-4 text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <h5 className="font-semibold text-gray-900 text-lg">AI Job Matching</h5>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes your skills and experience to find jobs with 90%+ match scores
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-4 text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h5 className="font-semibold text-gray-900 text-lg">Personalized Recommendations</h5>
                <p className="text-gray-600 leading-relaxed">
                  Get curated job suggestions tailored to your career goals and preferences
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-4 text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ArrowRight className="w-8 h-8 text-orange-600" />
                </div>
                <h5 className="font-semibold text-gray-900 text-lg">One-Click Applications</h5>
                <p className="text-gray-600 leading-relaxed">
                  Apply to verified jobs instantly with your optimized profile
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CVWelcomeGate;