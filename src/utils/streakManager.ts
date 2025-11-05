import { Stats } from '../types';
import { storage } from './storage';

export const updateStreak = (stats: Stats): Stats => {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = stats.lastActiveDate;

  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = stats.streak;

  if (diffDays === 0) {
    // Same day, keep streak
    newStreak = stats.streak;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    newStreak = stats.streak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  return {
    ...stats,
    streak: newStreak,
    lastActiveDate: today,
  };
};

export const addActivity = (stats: Stats, minutes: number): Stats => {
  const today = new Date().toISOString().split('T')[0];
  const updatedStats = updateStreak(stats);

  return {
    ...updatedStats,
    totalSessions: updatedStats.totalSessions + 1,
    totalMinutes: updatedStats.totalMinutes + minutes,
    activityMap: {
      ...updatedStats.activityMap,
      [today]: (updatedStats.activityMap[today] || 0) + minutes,
    },
  };
};

export const incrementAIQuery = () => {
  const stats = storage.getStats();
  const updatedStats = updateStreak(stats);
  updatedStats.aiQueries += 1;
  storage.saveStats(updatedStats);
};
