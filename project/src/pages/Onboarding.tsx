import { motion } from 'framer-motion';
import { BookOpen, Zap } from 'lucide-react';
import { storage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

export const Onboarding = () => {
  const navigate = useNavigate();

  const handleChoice = (choice: string) => {
    storage.setOnboarded();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        animate={{ x: [0, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-lg"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full"
      />
      <motion.div
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-lg transform rotate-45"
      />
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-40 right-1/3 w-20 h-20 bg-white/10 rounded-full"
      />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="text-8xl mb-6"
          >
            🤖
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Hey there!
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            What brings you to FocusQuest today?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice('study')}
            className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Study with Methods
            </h2>
            <p className="text-gray-600">
              Access the full productivity toolkit: Pomodoro, Eisenhower Matrix, Pareto Principle, Time Blocking, and Goal Tracking
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice('quick')}
            className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all group"
          >
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Quick Tools & AI Help
            </h2>
            <p className="text-gray-600">
              Jump straight to timers, notes, and AI assistant for quick productivity boosts
            </p>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/80 text-sm mt-12"
        >
          Your choice will be remembered for next time
        </motion.p>
      </div>
    </div>
  );
};
