import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Determine if we should show the sidebar
  const isAuthenticatedPage = location.pathname.startsWith('/seeker/') && 
                             !location.pathname.includes('/login') &&
                             !location.pathname.includes('/cv-welcome') &&
                             !location.pathname.includes('/cv-new');

  const isLandingPage = location.pathname === '/' || location.pathname === '/companies';
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/cv-welcome') || 
                     location.pathname.includes('/cv-new');

  if (isAuthenticatedPage) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
        
        <motion.main
          className="flex-1 overflow-auto"
          initial={false}
          animate={{ 
            marginLeft: sidebarCollapsed ? 80 : 288 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="min-h-full">
            {children}
          </div>
        </motion.main>
      </div>
    );
  }

  // For landing pages and auth pages, show the header
  return (
    <div className="min-h-screen bg-gray-50">
      {(isLandingPage || isAuthPage) && <Header />}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;