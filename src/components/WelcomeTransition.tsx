import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WelcomeTransitionProps {
  onComplete: () => void;
}

export const WelcomeTransition = ({ onComplete }: WelcomeTransitionProps) => {
  const [autoProgress, setAutoProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoProgress(true);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 overflow-hidden"
    >
      {/* Animated Mountains */}
      <motion.div
        animate={{ x: [0, -100, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-64"
      >
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          <path
            d="M0,250 L200,150 L400,200 L600,100 L800,180 L1000,140 L1200,220 L1200,300 L0,300 Z"
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{ x: [0, -80, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-0 left-0 right-0 h-48"
      >
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          <path
            d="M0,270 L150,200 L300,240 L500,160 L700,210 L900,170 L1200,250 L1200,300 L0,300 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </motion.div>

      {/* Clouds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: [window.innerWidth, -200] }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            delay: i * 2,
          }}
          className="absolute"
          style={{
            top: `${10 + i * 15}%`,
            opacity: 0.3,
          }}
        >
          <div className="w-24 h-16 bg-white rounded-full"></div>
          <div className="w-16 h-12 bg-white rounded-full absolute top-4 left-16"></div>
        </motion.div>
      ))}

      {/* Plants */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-20 left-20"
      >
        <div className="w-8 h-16 bg-green-400/30 rounded-t-full"></div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-24 right-32"
      >
        <div className="w-6 h-12 bg-green-500/30 rounded-t-full"></div>
      </motion.div>

      {/* Stars */}
      {[...Array(30)].map((_, i) => (
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
            top: `${Math.random() * 70}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="text-8xl mb-8"
        >
          🚀
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-4"
        >
          Welcome to FocusQuest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-xl md:text-2xl text-white/90 text-center mb-12"
        >
          Your Productivity Adventure Begins...
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ delay: 1.2 }}
          onClick={onComplete}
          className="relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-2xl">
            <Sparkles className="w-6 h-6" />
            Enter Quest
            <Sparkles className="w-6 h-6" />
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 text-white/60 text-sm"
        >
          Auto-starting in 3 seconds...
        </motion.div>
      </div>
    </motion.div>
  );
};
