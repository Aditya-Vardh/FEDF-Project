import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-lg blur-lg opacity-50"></div>
        <div className="relative bg-gradient-to-br from-theme-primary to-theme-secondary p-2 rounded-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </motion.div>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
          FocusQuest
        </h1>
        <p className="text-xs text-theme-text-secondary -mt-1">Project Toolkit</p>
      </div>
    </motion.div>
  );
};
