import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Globe,
  Play,
  Pause,
  CheckCircle,
  Star,
  User,
  Building2,
  FileText,
  Target
} from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  demo: React.ReactNode;
}

const FeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState('ai-matching');
  const [isPlaying, setIsPlaying] = useState(true);

  const features: Feature[] = [
    {
      id: 'ai-matching',
      icon: Brain,
      title: 'AI Job Matching',
      description: 'Get personalized match scores based on your skills, experience, and preferences.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      demo: <AIMatchingDemo />
    },
    {
      id: 'verified-jobs',
      icon: Shield,
      title: 'Verified Postings',
      description: 'Apply to jobs from companies that stake deposits to guarantee real opportunities.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      demo: <VerifiedJobsDemo />
    },
    {
      id: 'interview-coach',
      icon: MessageSquare,
      title: 'AI Interview Coach',
      description: 'Practice with our AI-powered interview coach to improve your success rate.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      demo: <InterviewCoachDemo />
    },
    {
      id: 'response-guarantee',
      icon: Clock,
      title: 'Response Guarantee',
      description: 'Get guaranteed responses within 21 days for all verified job applications.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      demo: <ResponseGuaranteeDemo />
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Job Search
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our features in action. Click on any feature to see how it works.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'border-blue-300 bg-white shadow-xl'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white'
                }`}
                onClick={() => setActiveFeature(feature.id)}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                  {activeFeature === feature.id && (
                    <motion.div
                      className="w-3 h-3 bg-blue-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Demo */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${activeFeatureData.bgColor} rounded-lg flex items-center justify-center`}>
                      <activeFeatureData.icon className={`w-5 h-5 bg-gradient-to-br ${activeFeatureData.color} bg-clip-text text-transparent`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{activeFeatureData.title}</h3>
                      <p className="text-sm text-gray-600">Live Demo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeFeatureData.demo}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Components
const AIMatchingDemo: React.FC = () => {
  const [matchScore, setMatchScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
      if (currentStep === 3) {
        setMatchScore(92);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentStep]);

  const steps = [
    { label: 'Analyzing CV', icon: FileText },
    { label: 'Matching Skills', icon: Target },
    { label: 'Calculating Score', icon: Brain },
    { label: 'Match Found!', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">CV Analysis in Progress</h4>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                index <= currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`transition-colors duration-500 ${
                index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index === currentStep && (
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {matchScore > 0 && (
        <motion.div
          className="bg-white border border-green-200 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{matchScore}% Match</div>
            <p className="text-gray-600 mb-4">Senior Frontend Developer at TechCorp</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${matchScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <span className="text-green-600">✓ React</span>
              <span className="text-green-600">✓ TypeScript</span>
              <span className="text-green-600">✓ Node.js</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const VerifiedJobsDemo: React.FC = () => {
  const [showVerification, setShowVerification] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowVerification(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">Senior Developer</h4>
            <p className="text-gray-600 text-sm">TechCorp Inc.</p>
          </div>
          <motion.div
            className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: showVerification ? 1 : 0, scale: showVerification ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-3 h-3" />
            <span>Verified</span>
          </motion.div>
        </div>
        <p className="text-gray-600 text-sm mb-3">$120k - $150k • Remote</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-green-800 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Company staked $500 deposit</span>
          </div>
          <p className="text-green-700 text-xs mt-1">
            Guaranteed response within 21 days or deposit goes to charity
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">Product Manager</h4>
            <p className="text-gray-600 text-sm">StartupXYZ</p>
          </div>
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            <span>Unverified</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">$100k - $130k • New York</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-700 text-xs">
            No response guarantee - apply at your own risk
          </p>
        </div>
      </div>
    </div>
  );
};

const InterviewCoachDemo: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const questions = [
    "Tell me about yourself",
    "Why do you want this role?",
    "What's your biggest strength?"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">AI Interview Coach</h4>
          <p className="text-sm text-gray-600">Practice with realistic interview questions</p>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <motion.p
            key={currentQuestion}
            className="text-gray-900 font-medium text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            "{questions[currentQuestion]}"
          </motion.p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 mb-3">AI Feedback</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Confidence: 8/10</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Clarity: 9/10</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Structure: 7/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResponseGuaranteeDemo: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(21);
  const [status, setStatus] = useState('pending');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft((prev) => {
        if (prev > 15) return prev - 1;
        if (prev === 15) {
          setStatus('responded');
          return prev;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
        <div className="text-center mb-4">
          <Clock className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900">Response Guarantee</h4>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Days Remaining</span>
            <span className="text-2xl font-bold text-orange-600">{daysLeft}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
              style={{ width: `${((21 - daysLeft) / 21) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {status === 'responded' && (
          <motion.div
            className="bg-green-100 border border-green-200 rounded-xl p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Response Received!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              TechCorp has invited you for an interview
            </p>
          </motion.div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 mb-3">Your Applications</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-700">Senior Developer</span>
            <span className="text-xs text-green-600 font-medium">Responded</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
            <span className="text-sm text-gray-700">Product Manager</span>
            <span className="text-xs text-orange-600 font-medium">{daysLeft} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;