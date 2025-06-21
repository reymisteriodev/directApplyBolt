import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  userType?: 'seeker' | 'company';
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userType, isAuthenticated = false }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Only show header on landing pages and auth pages
  const isLandingPage = location.pathname === '/' || location.pathname === '/companies';
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/cv-welcome') || 
                     location.pathname.includes('/cv-new');
  
  // Hide header on authenticated pages (they use sidebar instead)
  if (isAuthenticated && !isLandingPage && !isAuthPage) {
    return null;
  }

  // Show header on landing pages and auth pages
  if (isLandingPage || isAuthPage) {
    return (
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
                {userType === 'company' ? (
                  <Building2 className="w-5 h-5 text-white" />
                ) : (
                  <Search className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-gray-900 ml-2">DirectApply</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return null;
};

export default Header;