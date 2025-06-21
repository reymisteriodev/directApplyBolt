import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Star, 
  Upload,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

interface CVRecord {
  id: string;
  name: string;
  type: 'uploaded' | 'built';
  status: 'complete' | 'draft';
  isMain: boolean;
  lastModified: string;
  analysisScore?: number;
  fileName?: string;
  cvData: any;
}

const CVDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadUserCVs();
  }, [user]);

  const loadUserCVs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const cvRecords: CVRecord[] = data?.map((record, index) => {
        const cvData = record.cv_data;
        const isUploadedCV = cvData?.uploadedFile;
        
        // Generate a name for the CV
        let name = 'Untitled CV';
        if (isUploadedCV && cvData.uploadedFile.fileName) {
          name = cvData.uploadedFile.fileName.replace(/\.[^/.]+$/, ""); // Remove extension
        } else if (cvData?.personalInfo?.fullName) {
          name = `${cvData.personalInfo.fullName}'s CV`;
        } else {
          name = `CV ${index + 1}`;
        }

        // Determine status
        const isComplete = cvData?.personalInfo?.fullName && cvData?.personalInfo?.email && 
                          (cvData?.professionalSummary || cvData?.employmentHistory?.length > 0 || isUploadedCV);

        return {
          id: record.id,
          name,
          type: isUploadedCV ? 'uploaded' : 'built',
          status: isComplete ? 'complete' : 'draft',
          isMain: index === 0, // First CV is main by default
          lastModified: record.updated_at,
          analysisScore: isComplete ? Math.floor(Math.random() * 30) + 70 : undefined, // Mock score
          fileName: isUploadedCV ? cvData.uploadedFile.fileName : undefined,
          cvData: cvData
        };
      }) || [];

      // Sort CVs: Main CV first, then by last modified
      const sortedCVs = cvRecords.sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      });

      setCvs(sortedCVs);
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error('Failed to load your CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainCV = async (cvId: string) => {
    try {
      // Update the main CV in the state - ensure only one is main
      setCvs(cvs.map(cv => ({
        ...cv,
        isMain: cv.id === cvId
      })).sort((a, b) => {
        // Sort again to put main CV at top
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }));
      
      toast.success('Main CV updated successfully');
    } catch (error) {
      console.error('Error setting main CV:', error);
      toast.error('Failed to update main CV');
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return;
    }

    setDeletingId(cvId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', cvId);

      if (error) throw error;

      setCvs(cvs.filter(cv => cv.id !== cvId));
      toast.success('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewAnalysis = (cv: CVRecord) => {
    navigate('/seeker/cv-analysis', { 
      state: { 
        cvData: cv.cvData,
        fromDashboard: true 
      } 
    });
  };

  const handleEditCV = (cv: CVRecord) => {
    if (cv.type === 'uploaded') {
      // For uploaded CVs, we can't edit them directly, so show analysis instead
      handleViewAnalysis(cv);
    } else {
      // For built CVs, navigate to the builder with existing data
      navigate('/seeker/cv-builder', { 
        state: { 
          cvData: cv.cvData,
          editMode: true,
          cvId: cv.id
        } 
      });
    }
  };

  const handleCreateNewCV = () => {
    // Navigate to a streamlined CV creation modal/page
    navigate('/seeker/cv-new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="seeker" isAuthenticated={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CV Analysis Hub</h1>
            <p className="text-gray-600 mt-1">Manage all your CVs and track their performance</p>
          </div>
          <button
            onClick={handleCreateNewCV}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Analyze New CV</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total CVs', 
              value: cvs.length.toString(), 
              icon: FileText, 
              color: 'bg-blue-100 text-blue-600' 
            },
            { 
              label: 'Complete CVs', 
              value: cvs.filter(cv => cv.status === 'complete').length.toString(), 
              icon: CheckCircle, 
              color: 'bg-green-100 text-green-600' 
            },
            { 
              label: 'Drafts', 
              value: cvs.filter(cv => cv.status === 'draft').length.toString(), 
              icon: AlertCircle, 
              color: 'bg-yellow-100 text-yellow-600' 
            },
            { 
              label: 'Avg Score', 
              value: cvs.filter(cv => cv.analysisScore).length > 0 
                ? Math.round(cvs.filter(cv => cv.analysisScore).reduce((sum, cv) => sum + (cv.analysisScore || 0), 0) / cvs.filter(cv => cv.analysisScore).length).toString() + '%'
                : 'N/A', 
              icon: BarChart3, 
              color: 'bg-purple-100 text-purple-600' 
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CV List */}
        {cvs.length === 0 ? (
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">No CVs Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first CV. Our AI will help you build a professional CV that stands out.
            </p>
            <button
              onClick={handleCreateNewCV}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First CV</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* CV Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                      {cv.type === 'uploaded' ? (
                        <Upload className="w-8 h-8 text-orange-600" />
                      ) : (
                        <FileText className="w-8 h-8 text-orange-600" />
                      )}
                    </div>

                    {/* CV Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{cv.name}</h3>
                        {cv.isMain && (
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Main CV</span>
                          </span>
                        )}
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cv.status)}`}>
                          {getStatusIcon(cv.status)}
                          <span className="capitalize">{cv.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Modified {new Date(cv.lastModified).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{cv.type === 'uploaded' ? 'Uploaded CV' : 'Built with AI'}</span>
                        </div>
                        {cv.fileName && (
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{cv.fileName}</span>
                          </div>
                        )}
                      </div>

                      {/* Analysis Score */}
                      {cv.analysisScore && (
                        <div className="bg-orange-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-orange-900">Analysis Score</span>
                            </div>
                            <span className="text-2xl font-bold text-orange-600">{cv.analysisScore}%</span>
                          </div>
                          <div className="w-full bg-orange-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${cv.analysisScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-6">
                    {!cv.isMain && (
                      <button
                        onClick={() => handleSetMainCV(cv.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Set as Main CV"
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleViewAnalysis(cv)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Analysis"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleEditCV(cv)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={cv.type === 'uploaded' ? 'View Details' : 'Edit CV'}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      disabled={deletingId === cv.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete CV"
                    >
                      {deletingId === cv.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVDashboard;