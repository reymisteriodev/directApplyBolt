import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Edit3, 
  RefreshCw, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Zap,
  Plus,
  Eye,
  Download,
  ArrowLeft,
  Home
} from 'lucide-react';
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
  uploadedFile?: {
    fileName: string;
    filePath: string;
    uploadedAt: string;
    extractedText: string;
    fileSize: number;
    fileType: string;
  };
}

interface AnalysisIssue {
  id: string;
  section: string;
  field?: string;
  severity: 'urgent' | 'critical' | 'optional';
  title: string;
  description: string;
  suggestion: string;
  isFixed: boolean;
}

const CVAnalysis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [analysisCredits, setAnalysisCredits] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState('SATISFACTORY');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);
  
  const [issues, setIssues] = useState<AnalysisIssue[]>([
    {
      id: '1',
      section: 'personalInfo',
      field: 'linkedinUrl',
      severity: 'urgent',
      title: 'LinkedIn URL Missing',
      description: 'Your LinkedIn profile URL is not provided',
      suggestion: 'Add your complete LinkedIn profile URL to increase credibility',
      isFixed: false
    },
    {
      id: '2',
      section: 'professionalSummary',
      severity: 'critical',
      title: 'Summary Too Generic',
      description: 'Your professional summary lacks specific achievements',
      suggestion: 'Include quantifiable achievements and specific skills',
      isFixed: false
    },
    {
      id: '3',
      section: 'employmentHistory',
      field: 'description',
      severity: 'critical',
      title: 'Missing Quantified Results',
      description: 'Job descriptions lack measurable achievements',
      suggestion: 'Add specific metrics, percentages, or numbers to show impact',
      isFixed: false
    },
    {
      id: '4',
      section: 'personalInfo',
      field: 'phone',
      severity: 'optional',
      title: 'Phone Format',
      description: 'Phone number could be better formatted',
      suggestion: 'Use international format: +1 (555) 123-4567',
      isFixed: false
    }
  ]);

  useEffect(() => {
    if (location.state?.cvData) {
      setCvData(location.state.cvData);
      setFromDashboard(location.state?.fromDashboard || false);
      
      // If this is an uploaded CV, add specific analysis for extracted text
      if (location.state.cvData.uploadedFile?.extractedText) {
        analyzeUploadedCV(location.state.cvData);
      }
    } else {
      // Redirect back to CV dashboard if no data
      navigate('/seeker/cv-analysis-hub');
    }
  }, [location.state, navigate]);

  const analyzeUploadedCV = (data: CVData) => {
    const extractedText = data.uploadedFile?.extractedText || '';
    const additionalIssues: AnalysisIssue[] = [];

    // Analyze extracted text for common issues
    if (extractedText.length < 500) {
      additionalIssues.push({
        id: 'extracted-1',
        section: 'uploadedFile',
        severity: 'critical',
        title: 'CV Content Too Brief',
        description: 'Your CV appears to have limited content',
        suggestion: 'Consider adding more details about your experience and achievements',
        isFixed: false
      });
    }

    // Check for contact information in extracted text
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(extractedText);
    const hasPhone = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/.test(extractedText);
    
    if (!hasEmail) {
      additionalIssues.push({
        id: 'extracted-2',
        section: 'uploadedFile',
        severity: 'urgent',
        title: 'Email Not Found in CV',
        description: 'No email address detected in your uploaded CV',
        suggestion: 'Ensure your email address is clearly visible in your CV',
        isFixed: false
      });
    }

    if (!hasPhone) {
      additionalIssues.push({
        id: 'extracted-3',
        section: 'uploadedFile',
        severity: 'critical',
        title: 'Phone Number Not Found',
        description: 'No phone number detected in your uploaded CV',
        suggestion: 'Add your phone number to make it easy for employers to contact you',
        isFixed: false
      });
    }

    // Check for common keywords
    const hasSkillsSection = /skills|competencies|technologies/i.test(extractedText);
    if (!hasSkillsSection) {
      additionalIssues.push({
        id: 'extracted-4',
        section: 'uploadedFile',
        severity: 'critical',
        title: 'Skills Section Missing',
        description: 'No clear skills section found in your CV',
        suggestion: 'Add a dedicated skills section highlighting your technical and soft skills',
        isFixed: false
      });
    }

    setIssues(prev => [...prev, ...additionalIssues]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'critical': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'optional': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'optional': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getIssueCount = (severity: string) => {
    return issues.filter(issue => issue.severity === severity && !issue.isFixed).length;
  };

  const handleFixIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setEditingField(`${issue.section}-${issue.field || 'main'}`);
    }
  };

  const handleSaveEdit = (section: string, field: string, value: string) => {
    if (!cvData) return;

    const updatedCvData = { ...cvData };
    
    if (section === 'personalInfo') {
      (updatedCvData.personalInfo as any)[field] = value;
    } else if (section === 'professionalSummary') {
      updatedCvData.professionalSummary = value;
    }
    
    setCvData(updatedCvData);
    setEditingField(null);
    
    // Mark related issues as fixed
    setIssues(issues.map(issue => 
      issue.section === section && issue.field === field 
        ? { ...issue, isFixed: true }
        : issue
    ));
    
    toast.success('Changes saved successfully!');
  };

  const handleReAnalyze = () => {
    if (analysisCredits <= 0) {
      toast.error('No analysis credits remaining');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisCredits(prev => prev - 1);
    
    // Simulate re-analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('CV re-analyzed successfully!');
      
      // Update score based on fixed issues
      const fixedCount = issues.filter(i => i.isFixed).length;
      if (fixedCount >= 3) {
        setOverallScore('EXCELLENT');
      } else if (fixedCount >= 2) {
        setOverallScore('GOOD');
      }
    }, 3000);
  };

  const handleBackToDashboard = () => {
    if (fromDashboard) {
      navigate('/seeker/cv-analysis-hub');
    } else {
      navigate('/seeker/dashboard');
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/seeker/dashboard');
  };

  if (!cvData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="seeker" isAuthenticated={true} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{fromDashboard ? 'Back to CV Hub' : 'Back to Dashboard'}</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CV Analysis Report</h1>
                <p className="text-gray-600 mt-1">AI-powered insights to improve your CV</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Analysis Credits</p>
                <p className="text-2xl font-bold text-orange-600">{analysisCredits}</p>
              </div>
              <button
                onClick={handleReAnalyze}
                disabled={isAnalyzing || analysisCredits <= 0}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Re-analyzing...' : 'Re-Analyze'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{overallScore}</h2>
                <p className="text-gray-600">Overall CV Score</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">AI Analysis Complete</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-red-600">{getIssueCount('urgent')}</span>
                  </div>
                  <p className="text-sm text-gray-600">Urgent Fix</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-orange-600">{getIssueCount('critical')}</span>
                  </div>
                  <p className="text-sm text-gray-600">Critical Fix</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-blue-600">{getIssueCount('optional')}</span>
                  </div>
                  <p className="text-sm text-gray-600">Optional Fix</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Uploaded File Analysis (if applicable) */}
        {cvData.uploadedFile && (
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Uploaded CV Analysis</h3>
                    <p className="text-sm text-gray-600">{cvData.uploadedFile.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    <p>File Size: {Math.round(cvData.uploadedFile.fileSize / 1024)} KB</p>
                    <p>Uploaded: {new Date(cvData.uploadedFile.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setShowExtractedText(!showExtractedText)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showExtractedText ? 'Hide' : 'View'} Extracted Text</span>
                  </button>
                </div>
              </div>
            </div>
            
            {showExtractedText && (
              <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Extracted Text Content</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {cvData.uploadedFile.extractedText}
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This is the text content extracted from your uploaded CV file for analysis.
                </p>
              </div>
            )}

            {/* File-specific issues */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">File Analysis Issues</h4>
              <div className="space-y-3">
                {issues.filter(issue => issue.section === 'uploadedFile' && !issue.isFixed).map((issue) => (
                  <div key={issue.id} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div>
                          <h5 className="font-medium">{issue.title}</h5>
                          <p className="text-sm mt-1">{issue.description}</p>
                          <p className="text-sm mt-2 font-medium">💡 {issue.suggestion}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIssues(issues.map(i => 
                          i.id === issue.id ? { ...i, isFixed: true } : i
                        ))}
                        className="px-3 py-1 bg-white border border-current rounded text-sm hover:bg-opacity-10 transition-colors"
                      >
                        Mark as Fixed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CV Sections with Inline Analysis */}
        <div className="space-y-8">
          {/* Personal Information */}
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                {issues.some(i => i.section === 'personalInfo' && !i.isFixed) && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {issues.filter(i => i.section === 'personalInfo' && !i.isFixed).length} Issues
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <p className="text-gray-900">{cvData.personalInfo.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{cvData.personalInfo.email}</p>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {editingField === 'personalInfo-phone' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        defaultValue={cvData.personalInfo.phone}
                        className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        onBlur={(e) => handleSaveEdit('personalInfo', 'phone', e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{cvData.personalInfo.phone || 'Not provided'}</p>
                      {issues.find(i => i.section === 'personalInfo' && i.field === 'phone' && !i.isFixed) && (
                        <button
                          onClick={() => handleFixIssue(issues.find(i => i.section === 'personalInfo' && i.field === 'phone')?.id || '')}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>FIX</span>
                        </button>
                      )}
                    </div>
                  )}
                  {issues.find(i => i.section === 'personalInfo' && i.field === 'phone' && !i.isFixed) && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 {issues.find(i => i.section === 'personalInfo' && i.field === 'phone')?.suggestion}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  {editingField === 'personalInfo-linkedinUrl' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        defaultValue={cvData.personalInfo.linkedinUrl}
                        className="flex-1 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        onBlur={(e) => handleSaveEdit('personalInfo', 'linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{cvData.personalInfo.linkedinUrl || 'Not provided'}</p>
                        {cvData.personalInfo.linkedinUrl && (
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      {issues.find(i => i.section === 'personalInfo' && i.field === 'linkedinUrl' && !i.isFixed) && (
                        <button
                          onClick={() => handleFixIssue(issues.find(i => i.section === 'personalInfo' && i.field === 'linkedinUrl')?.id || '')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>FIX</span>
                        </button>
                      )}
                    </div>
                  )}
                  {issues.find(i => i.section === 'personalInfo' && i.field === 'linkedinUrl' && !i.isFixed) && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        ⚠️ {issues.find(i => i.section === 'personalInfo' && i.field === 'linkedinUrl')?.suggestion}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900">{cvData.personalInfo.githubUrl || 'Not provided'}</p>
                    {cvData.personalInfo.githubUrl && (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Summary */}
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Professional Summary</h3>
                {issues.some(i => i.section === 'professionalSummary' && !i.isFixed) && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {issues.filter(i => i.section === 'professionalSummary' && !i.isFixed).length} Issues
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative">
                {editingField === 'professionalSummary-main' ? (
                  <textarea
                    defaultValue={cvData.professionalSummary}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={4}
                    onBlur={(e) => handleSaveEdit('professionalSummary', 'main', e.target.value)}
                    autoFocus
                  />
                ) : (
                  <div className="flex items-start justify-between">
                    <p className="text-gray-900 leading-relaxed flex-1">
                      {cvData.professionalSummary || 'No professional summary provided'}
                    </p>
                    {issues.find(i => i.section === 'professionalSummary' && !i.isFixed) && (
                      <button
                        onClick={() => handleFixIssue(issues.find(i => i.section === 'professionalSummary')?.id || '')}
                        className="ml-4 flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>FIX</span>
                      </button>
                    )}
                  </div>
                )}
                
                {issues.find(i => i.section === 'professionalSummary' && !i.isFixed) && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      🔥 {issues.find(i => i.section === 'professionalSummary')?.suggestion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Employment History */}
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Employment History</h3>
                {issues.some(i => i.section === 'employmentHistory' && !i.isFixed) && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {issues.filter(i => i.section === 'employmentHistory' && !i.isFixed).length} Issues
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {cvData.employmentHistory.length > 0 ? (
                cvData.employmentHistory.map((employment, index) => (
                  <div key={employment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{employment.jobTitle}</h4>
                        <p className="text-gray-600">{employment.company}</p>
                        <p className="text-sm text-gray-500">
                          {employment.startDate} - {employment.endDate || 'Present'}
                        </p>
                      </div>
                      {issues.find(i => i.section === 'employmentHistory' && !i.isFixed) && index === 0 && (
                        <button
                          onClick={() => handleFixIssue(issues.find(i => i.section === 'employmentHistory')?.id || '')}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>FIX</span>
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">{employment.description}</p>
                    
                    {issues.find(i => i.section === 'employmentHistory' && !i.isFixed) && index === 0 && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          📊 {issues.find(i => i.section === 'employmentHistory')?.suggestion}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No employment history provided</p>
                  {cvData.uploadedFile && (
                    <p className="text-sm mt-2">Employment details may be in your uploaded CV file</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {cvData.education.length > 0 ? (
                cvData.education.map((education) => (
                  <div key={education.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{education.degree}</h4>
                    <p className="text-gray-600">{education.institution}</p>
                    <p className="text-sm text-gray-500">{education.graduationDate}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No education information provided</p>
                  {cvData.uploadedFile && (
                    <p className="text-sm mt-2">Education details may be in your uploaded CV file</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            onClick={() => navigate('/seeker/cv-builder')}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New CV</span>
          </button>
          <button
            onClick={handleContinueToDashboard}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Continue to Job Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVAnalysis;