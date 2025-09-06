import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Targeted Practice',
      description: 'Focus on the Excel skills that matter most in real interviews with personalized challenges.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'AI Interviewer',
      description: 'Practice with our intelligent AI that adapts to your skill level and provides realistic interview scenarios.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Performance Tracking',
      description: 'Monitor your progress with detailed analytics and receive personalized recommendations for improvement.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Feedback',
      description: 'Get instant feedback on your formulas, techniques, and problem-solving approaches as you practice.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Excel.AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Excel.AI is the ultimate platform for mastering Excel skills through AI-powered 
            interview practice. Whether you're preparing for your first job or advancing your 
            career, we help you build confidence and expertise in Excel.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-12 mb-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that everyone deserves the opportunity to succeed in their career. 
              Excel skills are essential in today's data-driven workplace, and traditional 
              learning methods often fall short of preparing candidates for real interview 
              scenarios. Our AI-powered platform bridges this gap by providing realistic, 
              personalized practice that adapts to your learning pace and style.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <div className="text-green-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-green-50 rounded-2xl p-12"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Interview</h3>
                <p className="text-gray-600">Begin your session with our AI interviewer who will assess your current skill level.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice & Learn</h3>
                <p className="text-gray-600">Work through realistic Excel challenges while receiving real-time guidance and feedback.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">Review detailed reports and follow personalized roadmaps to continuously improve.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their Excel skills and landed their dream jobs.
          </p>
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
            Start Your First Interview
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;