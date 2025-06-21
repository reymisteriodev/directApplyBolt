import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, Lock, Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const JobSeekerLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ isRateLimited: boolean; waitTime: number; message: string }>({
    isRateLimited: false,
    waitTime: 0,
    message: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const { signUp, signIn, user, hasCompletedCV, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle redirect ONLY for login attempts, NOT for registrations
  useEffect(() => {
    // Only redirect if:
    // 1. We have a user
    // 2. Auth is not loading
    // 3. User didn't just register (they should stay on login page)
    // 4. This is actually a login (not a registration that created a user)
    if (user && !authLoading && !justRegistered && isLogin) {
      console.log('Redirecting user after login. hasCompletedCV:', hasCompletedCV);
      
      if (hasCompletedCV) {
        // Returning user with CV - go to dashboard
        navigate('/seeker/dashboard');
      } else {
        // First time login or user without CV - go to welcome page
        navigate('/seeker/cv-welcome');
      }
    }
  }, [user, authLoading, justRegistered, hasCompletedCV, navigate, isLogin]);

  // Clear states when switching between login/signup
  useEffect(() => {
    setLoginError('');
    setRateLimitInfo({ isRateLimited: false, waitTime: 0, message: '' });
    // Don't reset justRegistered when switching to login mode after registration
    if (!isLogin) {
      setJustRegistered(false);
    }
  }, [isLogin]);

  // Rate limit countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (rateLimitInfo.isRateLimited && rateLimitInfo.waitTime > 0) {
      interval = setInterval(() => {
        setRateLimitInfo(prev => {
          const newWaitTime = prev.waitTime - 1;
          if (newWaitTime <= 0) {
            return { isRateLimited: false, waitTime: 0, message: '' };
          }
          return {
            ...prev,
            waitTime: newWaitTime,
            message: `Please wait ${newWaitTime} seconds before trying again.`
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rateLimitInfo.isRateLimited, rateLimitInfo.waitTime]);

  const extractWaitTimeFromError = (errorMessage: string): number => {
    const match = errorMessage.match(/after (\d+) seconds?/);
    return match ? parseInt(match[1], 10) : 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rateLimitInfo.isRateLimited) {
      toast.error(`Please wait ${rateLimitInfo.waitTime} seconds before trying again.`);
      return;
    }

    setLoading(true);
    setLoginError('');
    setRateLimitInfo({ isRateLimited: false, waitTime: 0, message: '' });

    try {
      if (isLogin) {
        // Handle login
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
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
        
        // Show different success messages based on CV completion status
        // Note: hasCompletedCV might not be updated yet, so we'll show a generic message
        // The specific welcome will be handled by the destination page
        if (hasCompletedCV) {
          toast.success('Welcome back!');
        } else {
          toast.success('Welcome! Let\'s get your profile set up.');
        }
        
        // Redirect will be handled by useEffect
      } else {
        // Handle registration - DO NOT navigate anywhere, just switch to login mode
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: 'seeker'
        });
        
        if (error) {
          if (error.message?.includes('For security purposes, you can only request this after') ||
              error.message?.includes('over_email_send_rate_limit') ||
              error.status === 429) {
            const waitTime = extractWaitTimeFromError(error.message);
            setRateLimitInfo({
              isRateLimited: true,
              waitTime: waitTime,
              message: `Please wait ${waitTime} seconds before trying again.`
            });
            toast.error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
          } else if (error.message?.includes('User already registered')) {
            toast.error('An account with this email already exists. Please sign in instead.');
            setIsLogin(true);
          } else {
            toast.error(error.message || 'Failed to create account');
          }
          return;
        }
        
        // After successful registration:
        // 1. Set justRegistered flag to prevent navigation
        // 2. Switch to login mode
        // 3. Show success message
        // 4. Clear form but keep email
        setJustRegistered(true);
        toast.success('Account created successfully! Please sign in to continue.');
        setIsLogin(true);
        setFormData({
          email: formData.email, // Keep the email for convenience
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
        
        // DO NOT NAVIGATE - stay on the same page
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error?.message?.includes('For security purposes, you can only request this after') ||
          error?.message?.includes('over_email_send_rate_limit') ||
          error?.status === 429) {
        const waitTime = extractWaitTimeFromError(error.message || '');
        setRateLimitInfo({
          isRateLimited: true,
          waitTime: waitTime,
          message: `Please wait ${waitTime} seconds before trying again.`
        });
        toast.error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
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

  const isLoadingState = loading || authLoading;
  const isFormDisabled = isLoadingState || rateLimitInfo.isRateLimited;

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

          {/* Success message for just registered users */}
          {justRegistered && isLogin && (
            <motion.div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-green-800 font-medium">
                ✅ Account created successfully! Please sign in to continue.
              </p>
            </motion.div>
          )}

          {/* Form */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
            {/* Rate Limit Warning */}
            {rateLimitInfo.isRateLimited && (
              <motion.div 
                className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Rate limit reached</p>
                  <p className="text-sm text-amber-700 mt-1">{rateLimitInfo.message}</p>
                  <div className="mt-2 text-xs text-amber-600">
                    <p>This is a security measure to prevent spam. Please wait before trying again.</p>
                  </div>
                </div>
              </motion.div>
            )}

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
                      disabled={isFormDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isFormDisabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isFormDisabled}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    disabled={isFormDisabled}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      loginError && loginError.includes('incorrect') 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isFormDisabled}
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

              <button
                type="submit"
                disabled={isFormDisabled}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingState ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {loading ? 'Please wait...' : 'Signing in...'}
                    </span>
                  </div>
                ) : rateLimitInfo.isRateLimited ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Wait {rateLimitInfo.waitTime}s</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isFormDisabled}
                className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isFormDisabled}
                  className="text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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