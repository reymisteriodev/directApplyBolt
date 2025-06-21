import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const CVNewGate: React.FC = () => {
  const navigate = useNavigate();
  const { user, setHasCompletedCV } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const parseFileContent = async (file: File): Promise<any> => {
    try {
      // Create FormData to send file to edge function
      const formData = new FormData();
      formData.append('file', file);

      // Call the edge function to parse the CV
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse CV');
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

    setIsUploading(true);

    try {
      // Parse the file using the edge function
      const parsedData = await parseFileContent(file);
      
      if (!parsedData.extractedText || parsedData.extractedText.trim().length < 50) {
        toast.error('Could not extract enough text from the file. Please try a different file or create a new CV.');
        setIsUploading(false);
        return;
      }

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/cv_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

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
        employmentHistory: [],
        education: [],
        uploadedFile: {
          fileName: file.name,
          filePath: uploadData.path,
          uploadedAt: new Date().toISOString(),
          extractedText: parsedData.extractedText,
          fileSize: file.size,
          fileType: file.type,
          parsedData: parsedData
        }
      };

      const { error: dbError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user?.id,
          cv_data: cvData,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      setHasCompletedCV(true);
      toast.success('CV uploaded and processed successfully!');
      navigate('/seeker/cv-analysis', { 
        state: { 
          cvData,
          fromDashboard: true 
        } 
      });

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
    navigate('/seeker/cv-builder', { 
      state: { 
        fromDashboard: true 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/seeker/cv-analysis-hub');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CV Hub</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyze New CV</h1>
            <p className="text-gray-600 mt-1">Upload an existing CV or create a new one</p>
          </div>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload CV Option */}
          <motion.div
            className="group"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer h-full relative overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Existing CV</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Upload your existing CV (PDF or Word) and our AI will analyze it for improvements.
                </p>
                
                <div className="space-y-4">
                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
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
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-blue-600 font-medium">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Drag & drop or click to browse
                            </p>
                            <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  <button
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    disabled={isUploading}
                    className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    {isUploading ? 'Processing...' : 'Choose File to Upload'}
                  </button>
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>PDF Support</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Word Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Create CV Option */}
          <motion.div
            className="group"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div 
              onClick={handleCreateCV}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Build New CV</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create a professional CV from scratch using our AI-powered guided builder.
                </p>
                
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105">
                  <span>Start Building</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>5 Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CVNewGate;