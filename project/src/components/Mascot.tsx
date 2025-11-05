import { motion } from 'framer-motion';
import { Bot, Coffee, Flame, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MascotProps {
  mode?: 'working' | 'break' | 'idle' | 'inactive';
}

const messages = {
  working: [
    'Grinding mode! Keep pushing 💪',
    'You got this! Stay focused!',
    'Compiling focus.exe...',
    'Zone mode activated!',
  ],
  break: [
    'Take a sip of water ☕',
    'Stretch those muscles!',
    'Rest well, warrior!',
    'Recharging... 🔋',
  ],
  idle: [
    '404: Motivation not found.',
    'Ready when you are!',
    'Let\'s conquer some tasks!',
    'Your quest awaits!',
  ],
  inactive: [
    'Stop procrastinating 😤',
    'Time to get back to work!',
    'The grind doesn\'t stop!',
    'Your future self will thank you!',
  ],
};

export const Mascot = ({ mode = 'idle' }: MascotProps) => {
  const [message, setMessage] = useState('');
  const [inactiveTimer, setInactiveTimer] = useState(0);

  useEffect(() => {
    const modeMessages = messages[mode];
    setMessage(modeMessages[Math.floor(Math.random() * modeMessages.length)]);
  }, [mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInactiveTimer((prev) => prev + 1);
    }, 60000); // Check every minute

    const resetTimer = () => setInactiveTimer(0);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  useEffect(() => {
    if (inactiveTimer >= 30 && mode === 'idle') {
      setMessage(messages.inactive[Math.floor(Math.random() * messages.inactive.length)]);
    }
  }, [inactiveTimer, mode]);

  const getIcon = () => {
    switch (mode) {
      case 'working':
        return <Flame className="w-8 h-8" />;
      case 'break':
        return <Coffee className="w-8 h-8" />;
      case 'inactive':
        return <Moon className="w-8 h-8" />;
      default:
        return <Bot className="w-8 h-8" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-theme-card backdrop-blur-md border border-theme-border rounded-2xl px-4 py-3 shadow-xl max-w-xs"
      >
        <p className="text-sm text-theme-text">{message}</p>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="bg-gradient-to-br from-theme-primary to-theme-secondary p-4 rounded-full shadow-2xl text-white"
      >
        {getIcon()}
      </motion.div>
    </motion.div>
  );
};
