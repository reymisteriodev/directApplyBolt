import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Shield, 
  Brain, 
  MessageSquare, 
  CheckCircle, 
  Star,
  Upload,
  Target,
  Clock,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  TrendingUp,
  Play,
  ChevronRight,
  Code,
  Database,
  Smartphone,
  Monitor,
  FileText,
  Eye,
  BarChart3,
  Sparkles,
  Layers,
  GitBranch,
  Building2,
  UserPlus
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import FeatureShowcase from '../components/FeatureShowcase';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const { userType, setUserType } = useTheme();
  const navigate = useNavigate();

  // Set theme to seekers when component mounts
  useEffect(() => {
    setUserType('seekers');
  }, [setUserType]);

  const handleSwitchToCompanies = () => {
    setUserType('companies');
    navigate('/companies');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DirectApply</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Pricing</a>
              
              {/* Job Seeker CTAs - SIMPLE NAVIGATION LINKS ONLY */}
              <div className="flex items-center space-x-4">
                <Link 
                  to="/seeker/login" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/seeker/login" 
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Start Job Search</span>
                </Link>
                
                {/* Prominent Company Toggle */}
                <div className="ml-4 pl-4 border-l border-gray-300">
                  <button
                    onClick={handleSwitchToCompanies}
                    className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-2 rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-lg border-2 border-slate-600 hover:border-slate-500"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>For Companies</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
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
                  <Link to="/seeker/login" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                    Sign In
                  </Link>
                  <Link 
                    to="/seeker/login" 
                    className="block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 text-sm font-medium text-center"
                  >
                    Start Job Search
                  </Link>
                  <button
                    onClick={handleSwitchToCompanies}
                    className="block w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 text-sm font-medium text-center"
                  >
                    For Companies
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
              className="inline-flex items-center bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Stop Applying into the Void
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover a smarter way to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                find your ideal job.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Find verified jobs that guarantee responses. No more ghost jobs, no more silence. 
              Get matched with opportunities that actually hire.
            </motion.p>
            
            {/* HERO CTA BUTTONS - SIMPLE NAVIGATION LINKS ONLY */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                to="/seeker/login"
                className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <span>Start Job Search</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/seeker/login"
                className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { number: '10,000+', label: 'Job Seekers' },
                { number: '500+', label: 'Verified Companies' },
                { number: '95%', label: 'Response Rate' }
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
          <div className="w-20 h-20 bg-orange-200 rounded-full"></div>
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 opacity-20"
          style={{ y: y2 }}
        >
          <div className="w-32 h-32 bg-red-200 rounded-full"></div>
        </motion.div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

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
              How DirectApply Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to transform your job search experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Create Your CV with AI',
                description: 'Let AI help you create a standout CV, smart, effortless, and tailored to you.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                icon: Target,
                title: 'Get Matched with the Right Jobs',
                description: 'No more endless searching. AI automatically finds job opportunities that fit your skills.',
                color: 'from-green-500 to-green-600'
              },
              {
                step: '03',
                icon: Shield,
                title: 'Safe & Verified Companies',
                description: 'We ensure every listed company is verified and secure, so you can focus on your future.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                step: '04',
                icon: MessageSquare,
                title: 'Apply in One Click',
                description: 'Found the right role? Apply instantly. It\'s that easy — no long forms, no hassle.',
                color: 'from-orange-500 to-orange-600'
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
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

      {/* Trusted Companies Section with Smooth Animation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-500 text-sm font-medium mb-8">
              Trusted by leading companies worldwide
            </p>
          </motion.div>

          {/* Animated Company Logos */}
          <div className="relative overflow-hidden">
            <div className="flex space-x-12 items-center animate-scroll">
              {/* First set of logos */}
              {[
                { name: 'TechCorp', color: '#3B82F6' },
                { name: 'InnovateLab', color: '#10B981' },
                { name: 'DataFlow', color: '#8B5CF6' },
                { name: 'CloudTech', color: '#F59E0B' },
                { name: 'StartupXYZ', color: '#EF4444' },
                { name: 'DesignPro', color: '#06B6D4' },
                { name: 'DevStudio', color: '#84CC16' },
                { name: 'AIVentures', color: '#F97316' },
              ].map((company, index) => (
                <motion.div
                  key={`first-${company.name}`}
                  className="flex-shrink-0 w-36 h-20 bg-white rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg group border border-gray-100"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: company.color + '10'
                  }}
                >
                  <span 
                    className="font-bold text-lg transition-colors duration-300 group-hover:opacity-100 opacity-40"
                    style={{ color: company.color }}
                  >
                    {company.name}
                  </span>
                </motion.div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'TechCorp', color: '#3B82F6' },
                { name: 'InnovateLab', color: '#10B981' },
                { name: 'DataFlow', color: '#8B5CF6' },
                { name: 'CloudTech', color: '#F59E0B' },
                { name: 'StartupXYZ', color: '#EF4444' },
                { name: 'DesignPro', color: '#06B6D4' },
                { name: 'DevStudio', color: '#84CC16' },
                { name: 'AIVentures', color: '#F97316' },
              ].map((company, index) => (
                <motion.div
                  key={`second-${company.name}`}
                  className="flex-shrink-0 w-36 h-20 bg-white rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg group border border-gray-100"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: company.color + '10'
                  }}
                >
                  <span 
                    className="font-bold text-lg transition-colors duration-300 group-hover:opacity-100 opacity-40"
                    style={{ color: company.color }}
                  >
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that works for you
            </p>
          </motion.div>

          {/* Pricing Cards for Job Seekers */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Browse all job listings</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Apply to verified jobs</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Basic application tracking</span>
                </li>
              </ul>
              <Link 
                to="/seeker/login"
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-center block text-sm"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl border-2 border-orange-500 relative shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$19<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">AI match scores</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">AI interview coach</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Priority support</span>
                </li>
              </ul>
              <Link 
                to="/seeker/login"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-medium text-center block text-sm"
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
              <p className="text-4xl font-bold text-gray-900 mb-6">$49<span className="text-lg text-gray-500 font-normal">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Unlimited applications</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Career coaching sessions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">White-glove support</span>
                </li>
              </ul>
              <Link 
                to="/seeker/login"
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
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DirectApply</span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of transparent hiring. Find real jobs that guarantee responses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/seeker/login" className="hover:text-white transition-colors">Find Jobs</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Coach</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleSwitchToCompanies} className="hover:text-white transition-colors">Post Jobs</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Hiring Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
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

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;