import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import CompanyLandingPage from './pages/CompanyLandingPage';
import JobSeekerLogin from './pages/JobSeekerLogin';
import CompanyLogin from './pages/CompanyLogin';
import CVWelcomeGate from './pages/CVWelcomeGate';
import CVNewGate from './pages/CVNewGate';
import CVBuilder from './pages/CVBuilder';
import CVAnalysis from './pages/CVAnalysis';
import CVDashboard from './pages/CVDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import JobMatchingDashboard from './pages/JobMatchingDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import Profile from './pages/Profile';
import InterviewCoach from './pages/InterviewCoach';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicantManagement from './pages/ApplicantManagement';
import CommunityForum from './pages/CommunityForum';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/companies" element={<CompanyLandingPage />} />
              <Route path="/seeker/login" element={<JobSeekerLogin />} />
              <Route path="/company/login" element={<CompanyLogin />} />
              <Route path="/seeker/cv-welcome" element={<CVWelcomeGate />} />
              <Route path="/seeker/cv-new" element={<CVNewGate />} />
              <Route path="/seeker/cv-builder" element={<CVBuilder />} />
              <Route path="/seeker/cv-analysis" element={<CVAnalysis />} />
              <Route path="/seeker/cv-analysis-hub" element={<CVDashboard />} />
              <Route path="/seeker/dashboard" element={<JobMatchingDashboard />} />
              <Route path="/seeker/jobs" element={<JobSeekerDashboard />} />
              <Route path="/seeker/community" element={<CommunityForum />} />
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/seeker/profile" element={<Profile />} />
              <Route path="/seeker/interview-coach" element={<InterviewCoach />} />
              <Route path="/seeker/applications" element={<ApplicationTracker />} />
              <Route path="/company/applicants/:jobId" element={<ApplicantManagement />} />
            </Routes>
            <Toaster position="top-right" />
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;