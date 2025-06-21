import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Building2, LogOut, FileText, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  userType?: 'seeker' | 'company';
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userType, isAuthenticated = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, hasCompletedCV } = useAuth();
  const { theme } = useTheme();
  const isLandingPage = location.pathname === '/' || location.pathname === '/companies';

  if (isLandingPage) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
                {userType === 'company' ? (
                  <Building2 className="w-5 h-5 text-white" />
                ) : (
                  <Search className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-gray-900">DirectApply</span>
            </Link>
          </div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              {userType === 'seeker' ? (
                <>
                  <Link
                    to="/seeker/dashboard"
                    className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/seeker/applications"
                    className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/seeker/interview-coach"
                    className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    Interview Coach
                  </Link>
                  {/* CV Analysis Hub Link */}
                  <Link
                    to="/seeker/cv-analysis-hub"
                    className={`flex items-center space-x-1 text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>CV Analysis</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/company/dashboard"
                    className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/company/jobs"
                    className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                  >
                    Job Postings
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={userType === 'seeker' ? '/seeker/profile' : '/company/profile'}
                  className={`p-2 text-gray-400 hover:${theme.accent} transition-colors`}
                >
                  {userType === 'seeker' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className={`p-2 text-gray-400 hover:${theme.accent} transition-colors`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/seeker/login"
                  className={`text-gray-700 hover:${theme.accent} font-medium transition-colors text-sm`}
                >
                  Job Seekers
                </Link>
                <Link
                  to="/company/login"
                  className={`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2 rounded-lg hover:${theme.gradientHover} transition-all duration-200 font-medium text-sm`}
                >
                  For Companies
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;