import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Shield, 
  Brain, 
  Users, 
  CheckCircle, 
  Star,
  Target,
  Clock,
  DollarSign,
  Award,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  TrendingUp,
  Building2,
  UserCheck,
  BarChart3,
  Sparkles,
  Eye,
  Filter,
  MessageSquare,
  FileText,
  UserPlus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const CompanyLandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const { userType, setUserType, theme } = useTheme();
  const navigate = useNavigate();

  // Set theme to companies when component mounts
  useEffect(() => {
    setUserType('companies');
  }, [setUserType]);

  const handleSwitchToSeekers = () => {
    setUserType('seekers');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DirectApply</span>
              <span className="text-sm text-gray-500 ml-2">for Companies</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Pricing</a>
              
              {/* Company CTAs */}
              <div className="flex items-center space-x-4">
                <Link 
                  to="/company/login" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/company/login" 
                  className={`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2 rounded-lg hover:${theme.gradientHover} transition-all duration-200 text-sm font-medium flex items-center space-x-1 shadow-lg`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Post Jobs</span>
                </Link>
                <button
                  onClick={handleSwitchToSeekers}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>For Job Seekers</span>
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Pricing</a>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Link to="/company/login" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Login
                  </Link>
                  <Link 
                    to="/company/login" 
                    className={`block bg-gradient-to-r ${theme.gradient} text-white px-4 py-2 rounded-lg hover:${theme.gradientHover} transition-all duration-200 text-sm font-medium text-center`}
                  >
                    Post Jobs
                  </Link>
                  <button
                    onClick={handleSwitchToSeekers}
                    className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    For Job Seekers
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className={`inline-flex items-center ${theme.primaryLight} border border-slate-200 ${theme.accent} px-4 py-2 rounded-full text-sm font-medium mb-8`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Hire Verified Talent with Guaranteed Results
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Hire top talent{' '}
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                faster and smarter.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Access pre-screened candidates, eliminate ghost applications, and build your team 
              with confidence using our verified hiring platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                to="/company/login"
                className={`bg-gradient-to-r ${theme.gradient} text-white px-8 py-4 rounded-xl text-lg font-semibold hover:${theme.gradientHover} transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg`}
              >
                <Building2 className="w-5 h-5" />
                <span>Start Hiring</span>
              </Link>
              <button className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Request Demo</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { number: '500+', label: 'Companies Hiring' },
                { number: '10,000+', label: 'Verified Candidates' },
                { number: '3x', label: 'Faster Hiring' }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 opacity-20"
          style={{ y: y1 }}
        >
          <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 opacity-20"
          style={{ y: y2 }}
        >
          <div className="w-32 h-32 bg-amber-200 rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for{' '}
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                Smart Hiring
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to hire the best talent efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: UserCheck,
                title: 'Pre-Screened Candidates',
                description: 'Access candidates who have been verified and pre-screened by our AI.',
                color: 'text-slate-600'
              },
              {
                icon: Shield,
                title: 'Verified Job Postings',
                description: 'Stake a deposit to guarantee responses and attract serious candidates.',
                color: 'text-green-600'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track your hiring performance with detailed insights and metrics.',
                color: 'text-amber-600'
              },
              {
                icon: Zap,
                title: 'Instant Matching',
                description: 'Get matched with qualified candidates instantly using AI algorithms.',
                color: 'text-blue-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 ${theme.accentLight} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to hire your next team member
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Post Your Job',
                description: 'Create a detailed job posting with requirements and company information.',
                color: 'from-slate-500 to-slate-600'
              },
              {
                step: '02',
                icon: Shield,
                title: 'Verify & Stake',
                description: 'Verify your posting with a small deposit to attract serious candidates.',
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                icon: Users,
                title: 'Review Candidates',
                description: 'Get matched with pre-screened candidates and review their profiles.',
                color: 'from-amber-500 to-amber-600'
              },
              {
                step: '04',
                icon: CheckCircle,
                title: 'Hire with Confidence',
                description: 'Make offers to the best candidates and build your dream team.',
                color: 'from-blue-500 to-blue-600'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative mb-8">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-slate-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transparent pricing for companies
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your hiring needs
            </p>
          </motion.div>

          {/* Pricing Cards for Companies */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$99<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Post up to 3 jobs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Basic applicant management</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Standard support</span>
                </li>
              </ul>
              <Link 
                to="/company/login"
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-center block text-sm"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl border-2 border-slate-500 relative shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className={`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2 rounded-full text-sm font-medium`}>Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$299<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Post up to 10 jobs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">AI match scoring</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Priority support</span>
                </li>
              </ul>
              <Link 
                to="/company/login"
                className={`w-full bg-gradient-to-r ${theme.gradient} text-white py-3 px-4 rounded-xl hover:${theme.gradientHover} transition-all duration-200 font-medium text-center block text-sm`}
              >
                Start Free Trial
              </Link>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">Custom</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Unlimited job postings</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">White-label options</span>
                </li>
              </ul>
              <Link 
                to="/company/login"
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-center block text-sm"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DirectApply</span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of transparent hiring. Hire verified talent with confidence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/company/login" className="hover:text-white transition-colors">Post Jobs</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Hiring Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleSwitchToSeekers} className="hover:text-white transition-colors">Find Jobs</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Coach</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DirectApply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyLandingPage;