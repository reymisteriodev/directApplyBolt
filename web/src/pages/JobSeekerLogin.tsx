import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const JobSeekerLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false); // SEPARATE FROM AUTH LOADING
  const [loginError, setLoginError] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false); // PREVENT MULTIPLE REDIRECTS
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const { signUp, signIn, user, hasCompletedCV, hasSeenWelcome, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect after authentication - but only once
  useEffect(() => {
    // Only redirect if we have a user, auth is not loading, form is not submitting, and we haven't redirected yet
    if (user && !authLoading && !isFormSubmitting && !hasRedirected) {
      console.log('🚀 User authenticated, determining redirect...', {
        hasCompletedCV,
        hasSeenWelcome,
        isLogin
      });

      setHasRedirected(true); // PREVENT MULTIPLE REDIRECTS

      // Small delay to ensure state is properly set
      setTimeout(() => {
        if (isLogin) {
          // For existing users logging in
          if (hasCompletedCV) {
            console.log('✅ Existing user with CV → Dashboard');
            navigate('/seeker/dashboard');
          } else if (hasSeenWelcome) {
            console.log('🔄 User seen welcome but no CV → CV Builder');
            navigate('/seeker/cv-builder');
          } else {
            console.log('👋 First time user → Welcome');
            navigate('/seeker/cv-welcome');
          }
        } else {
          // For new registrations - always go to welcome
          console.log('🆕 New registration → Welcome');
          navigate('/seeker/cv-welcome');
        }
      }, 100);
    }
  }, [user, authLoading, isFormSubmitting, hasCompletedCV, hasSeenWelcome, navigate, isLogin, hasRedirected]);

  // Clear login error when switching modes or typing
  useEffect(() => {
    setLoginError('');
    setHasRedirected(false); // RESET REDIRECT FLAG WHEN SWITCHING MODES
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isFormSubmitting) {
      console.log('⏳ Form already processing, ignoring submission');
      return;
    }

    // Validate form data
    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    console.log('🚀 Starting form submission...');
    setIsFormSubmitting(true); // ONLY FORM LOADING, NOT AUTH LOADING
    setLoginError('');

    try {
      if (isLogin) {
        console.log('🔐 Attempting login for:', formData.email);
        
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          console.error('❌ Login error:', error);
          
          // Handle specific authentication errors
          if (error.message?.includes('Invalid login credentials') || 
              error.message?.includes('invalid_credentials')) {
            setLoginError('The email or password you entered is incorrect. Please check your credentials and try again.');
            toast.error('Invalid email or password');
          } else if (error.message?.includes('Email not confirmed')) {
            setLoginError('Please check your email and click the confirmation link before signing in.');
            toast.error('Please confirm your email address');
          } else if (error.message?.includes('Too many requests')) {
            setLoginError('Too many login attempts. Please wait a few minutes before trying again.');
            toast.error('Too many attempts. Please wait and try again.');
          } else {
            setLoginError('Unable to sign in. Please try again or contact support if the problem persists.');
            toast.error(error.message || 'Failed to sign in');
          }
          return;
        }
        
        console.log('✅ Login successful');
        toast.success('Welcome back!');
        // Navigation will be handled by useEffect
        
      } else {
        console.log('📝 Attempting registration for:', formData.email);
        
        // Validation
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          toast.error('Please enter your first and last name');
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: 'seeker'
        });
        
        if (error) {
          console.error('❌ Registration error:', error);
          if (error.message?.includes('User already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
            setIsLogin(true);
          } else {
            toast.error(error.message || 'Failed to create account');
          }
          return;
        }
        
        console.log('✅ Registration successful');
        toast.success('Account created successfully! Let\'s set up your profile.');
        // Navigation will be handled by useEffect
      }
    } catch (error: any) {
      console.error('💥 Auth error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('🏁 Form submission complete, resetting loading state');
      setIsFormSubmitting(false); // ALWAYS RESET FORM LOADING
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loginError) {
      setLoginError('');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Show a simple loading screen only if auth is still initializing AND we don't have a user yet
  if (authLoading && !user) {
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
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">DirectApply</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin 
                ? 'Sign in to find your next opportunity' 
                : 'Join thousands of job seekers finding verified opportunities'
              }
            </p>
          </div>

          {/* Form */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
            {/* Login Error Display */}
            {loginError && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{loginError}</p>
                  {loginError.includes('incorrect') && (
                    <div className="mt-2 text-xs text-red-600">
                      <p>• Make sure your email address is spelled correctly</p>
                      <p>• Check that your password is entered correctly (passwords are case-sensitive)</p>
                      <p>• If you don't have an account yet, click "Sign up" below</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required={!isLogin}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isFormSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required={!isLogin}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isFormSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isFormSubmitting}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                      loginError && loginError.includes('incorrect') 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isFormSubmitting}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                      loginError && loginError.includes('incorrect') 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isFormSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isFormSubmitting}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      disabled={isFormSubmitting}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-orange-600 hover:text-orange-700">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* COMPLETELY SEPARATE FORM LOADING FROM AUTH LOADING */}
              <button
                type="submit"
                disabled={isFormSubmitting}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFormSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                  disabled={isFormSubmitting}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Looking to hire talent?{' '}
              <Link to="/company/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Company Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobSeekerLogin;