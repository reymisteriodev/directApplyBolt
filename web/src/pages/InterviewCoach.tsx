import React, { useState } from 'react';
import { Play, Pause, Mic, MicOff, RotateCcw, Award } from 'lucide-react';

const InterviewCoach: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const mockQuestions = [
    "Tell me about yourself and your professional background.",
    "Why are you interested in this position?",
    "What are your greatest strengths and weaknesses?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "Where do you see yourself in 5 years?"
  ];

  const startSession = () => {
    setIsSessionActive(true);
    setCurrentQuestion(0);
  };

  const endSession = () => {
    setIsSessionActive(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Interview Coach</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with our AI-powered coach. Get personalized feedback 
            and improve your confidence before the real interview.
          </p>
        </div>

        {/* Premium Badge */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">Premium Feature</h3>
                <p className="text-orange-700 text-sm">Upgrade to Pro to access the AI Interview Coach</p>
              </div>
            </div>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {!isSessionActive ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Play className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Start Your Practice Session?</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Our AI coach will ask you common interview questions and provide real-time feedback 
                    on your responses, body language, and speaking pace.
                  </p>
                  <button
                    onClick={startSession}
                    className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center space-x-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Practice Interview</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Question Display */}
                  <div className="text-center mb-8">
                    <div className="bg-orange-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-orange-900 mb-3">
                        Question {currentQuestion + 1} of {mockQuestions.length}
                      </h3>
                      <p className="text-orange-800 text-lg leading-relaxed">
                        {mockQuestions[currentQuestion]}
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full border-2 transition-colors ${
                        isMuted 
                          ? 'border-red-300 bg-red-50 text-red-600' 
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                    
                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion === mockQuestions.length - 1}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Question
                    </button>
                    
                    <button
                      onClick={endSession}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Interview Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain eye contact with the camera</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use the STAR method for behavioral questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep answers concise but detailed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Show enthusiasm and positivity</span>
                </li>
              </ul>
            </div>

            {/* Previous Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">General Interview</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="text-xs text-gray-600">Score: 85/100</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">Technical Interview</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <div className="text-xs text-gray-600">Score: 78/100</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  View Feedback History
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  Download Session Reports
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                  Schedule Live Coaching
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCoach;