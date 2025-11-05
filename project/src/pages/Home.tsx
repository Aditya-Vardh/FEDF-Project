import { motion } from 'framer-motion';
import { Flame, Clock, TrendingUp, Target } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Heatmap } from '../components/Heatmap';
import { Mascot } from '../components/Mascot';
import { useState, useEffect } from 'react';

const taglines = [
  'Forge Your Focus.',
  'Defeat Procrastination.',
  'Study. Grind. Repeat.',
  'Your Quest Starts Now.',
  'Level Up Your Productivity.',
  'Conquer Your Goals.',
];

const facts = [
  'The Pomodoro Technique was invented in the late 1980s by Francesco Cirillo.',
  'Studies show that taking breaks actually increases productivity by up to 30%.',
  'The human brain can only focus intensely for about 25 minutes at a time.',
  'The Eisenhower Matrix was used by President Dwight D. Eisenhower to prioritize tasks.',
  'The Pareto Principle states that 80% of results come from 20% of efforts.',
  'Time blocking is used by Bill Gates and Elon Musk to manage their schedules.',
];

export const Home = () => {
  const { stats } = useApp();
  const [tagline, setTagline] = useState(taglines[0]);
  const [fact, setFact] = useState(facts[0]);

  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setTagline(taglines[Math.floor(Math.random() * taglines.length)]);
    }, 4000);

    const factInterval = setInterval(() => {
      setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 8000);

    return () => {
      clearInterval(taglineInterval);
      clearInterval(factInterval);
    };
  }, []);

  const getStreakMessage = () => {
    if (stats.streak === 0) return 'Start your journey today!';
    if (stats.streak < 3) return 'Great start! Keep it up!';
    if (stats.streak < 7) return 'You\'re on fire! 🔥';
    if (stats.streak < 30) return 'Amazing streak! You\'re unstoppable!';
    return 'Legendary! You\'re a productivity master! 👑';
  };

  const hours = Math.floor(stats.totalMinutes / 60);
  const minutes = stats.totalMinutes % 60;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <motion.h1
          key={tagline}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent mb-2"
        >
          {tagline}
        </motion.h1>
        <p className="text-theme-text-secondary">Track your progress and stay motivated</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-theme-text">{stats.streak}</span>
          </div>
          <h3 className="text-theme-text-secondary text-sm mb-1">Day Streak</h3>
          <p className="text-xs text-theme-primary font-medium">{getStreakMessage()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-theme-text">{stats.totalSessions}</span>
          </div>
          <h3 className="text-theme-text-secondary text-sm mb-1">Focus Sessions</h3>
          <p className="text-xs text-theme-primary font-medium">Total completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-theme-text">
              {hours > 0 ? `${hours}h` : `${minutes}m`}
            </span>
          </div>
          <h3 className="text-theme-text-secondary text-sm mb-1">Time Spent</h3>
          <p className="text-xs text-theme-primary font-medium">
            {hours > 0 && minutes > 0 ? `${hours}h ${minutes}m total` : 'Keep going!'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-theme-text">{stats.aiQueries}</span>
          </div>
          <h3 className="text-theme-text-secondary text-sm mb-1">AI Queries</h3>
          <p className="text-xs text-theme-primary font-medium">Questions asked</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-lg mb-8"
      >
        <h2 className="text-xl font-bold text-theme-text mb-4">Activity Heatmap</h2>
        <Heatmap activityMap={stats.activityMap} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-theme-primary to-theme-secondary rounded-2xl p-6 shadow-lg text-white"
      >
        <h3 className="text-lg font-bold mb-2">Did you know?</h3>
        <motion.p
          key={fact}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/90"
        >
          {fact}
        </motion.p>
      </motion.div>

      <Mascot mode="idle" />
    </div>
  );
};
