import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      // Get user profile data from CV
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('cv_data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      let profile = {
        name: 'User',
        title: 'Job Seeker',
        email: user.email || ''
      };

      // Try to get name from auth metadata first
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      if (firstName || lastName) {
        profile.name = `${firstName} ${lastName}`.trim();
      }

      // Get additional info from CV data if available
      if (!error && profileData && profileData.length > 0 && profileData[0]?.cv_data) {
        const cvData = profileData[0].cv_data;
        
        // Use CV name if auth name is not available
        if (profile.name === 'User' && cvData.personalInfo?.fullName) {
          profile.name = cvData.personalInfo.fullName;
        }
        
        // Try to infer title from employment history
        if (cvData.employmentHistory && cvData.employmentHistory.length > 0) {
          const latestJob = cvData.employmentHistory[0];
          if (latestJob.jobTitle) {
            profile.title = latestJob.jobTitle;
          }
        }
      }

      // Fallback to email username if still no name
      if (profile.name === 'User' && user.email) {
        profile.name = user.email.split('@')[0];
      }

      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set fallback profile
      setUserProfile({
        name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
        title: 'Job Seeker',
        email: user.email || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const menuItems = [
    {
      category: 'JOB SEARCH',
      items: [
        {
          icon: Home,
          label: 'Dashboard',
          path: '/seeker/dashboard',
          description: 'Main job feed'
        },
        {
          icon: Target,
          label: 'My Applications',
          path: '/seeker/applications',
          description: 'Track your applications'
        }
      ]
    },
    {
      category: 'CAREER TOOLS',
      items: [
        {
          icon: BarChart3,
          label: 'CV Analysis',
          path: '/seeker/cv-analysis-hub',
          description: 'CV dashboard & analyzer'
        },
        {
          icon: MessageSquare,
          label: 'Interview Coach',
          path: '/seeker/interview-coach',
          description: 'Practice interviews'
        }
      ]
    },
    {
      category: 'COMMUNITY',
      items: [
        {
          icon: Users,
          label: 'Forum',
          path: '/seeker/community',
          description: 'Community discussions'
        }
      ]
    }
  ];

  const bottomItems = [
    {
      icon: Settings,
      label: 'Settings',
      path: '/seeker/profile',
      description: 'Account settings'
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DirectApply</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              getInitials(userProfile?.name || 'U')
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-semibold text-gray-900 truncate">
                  {userProfile?.name || 'Loading...'}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {userProfile?.title || 'Job Seeker'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.category}>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h4
                    className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: sectionIndex * 0.05 }}
                  >
                    {section.category}
                  </motion.h4>
                )}
              </AnimatePresence>
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group ${
                      isActivePath(item.path)
                        ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                      isActivePath(item.path) ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-500'
                    }`} />
                    
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div
                          className="flex-1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex flex-col">
                            <span>{item.label}</span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-600">
                              {item.description}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-6 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center py-3 text-sm font-medium transition-all duration-200 group ${
              isActivePath(item.path)
                ? 'text-orange-600'
                : 'text-gray-700 hover:text-orange-600'
            } ${isCollapsed ? 'justify-center' : 'px-3'}`}
          >
            <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
              isActivePath(item.path) ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-500'
            }`} />
            
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
        
        <button
          onClick={handleSignOut}
          className={`flex items-center py-3 text-sm font-medium text-gray-700 hover:text-red-600 transition-all duration-200 group w-full ${
            isCollapsed ? 'justify-center' : 'px-3'
          }`}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} text-gray-400 group-hover:text-red-500`} />
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;