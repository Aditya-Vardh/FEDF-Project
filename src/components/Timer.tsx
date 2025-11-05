import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { addActivity } from '../utils/streakManager';

interface TimerProps {
  workMinutes?: number;
  breakMinutes?: number;
  onTimerComplete?: () => void;
}

export const Timer = ({ workMinutes = 25, breakMinutes = 5, onTimerComplete }: TimerProps) => {
  const { stats, updateStats } = useApp();
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        const newStats = addActivity(stats, workMinutes);
        updateStats(newStats);
      }
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? workMinutes * 60 : breakMinutes * 60);
      onTimerComplete?.();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, workMinutes, breakMinutes, stats, updateStats, onTimerComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((workMinutes * 60 - timeLeft) / (workMinutes * 60)) * 100;

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  return (
    <div className="relative">
      <svg className="w-64 h-64 transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-300 dark:text-gray-700"
        />
        <motion.circle
          cx="128"
          cy="128"
          r="120"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={2 * Math.PI * 120}
          strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
          strokeLinecap="round"
          className={isBreak ? 'text-blue-500' : 'text-theme-primary'}
          initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-theme-text">{formatTime(timeLeft)}</div>
        <div className="text-sm text-theme-text-secondary mt-2">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRunning(!isRunning)}
            className="p-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-white rounded-full shadow-lg"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={reset}
            className="p-3 bg-theme-card border border-theme-border text-theme-text rounded-full shadow-lg"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
