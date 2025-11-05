import { Task, Stats, Theme } from '../types';

const STORAGE_KEYS = {
  TASKS: 'focusquest_tasks',
  COMPLETED_TASKS: 'focusquest_completed_tasks',
  STATS: 'focusquest_stats',
  THEME: 'focusquest_theme',
  ONBOARDED: 'focusquest_onboarded',
  WELCOME_SHOWN: 'focusquest_welcome_shown',
  NOTES: 'focusquest_notes',
};

export const storage = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getStats: (): Stats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return JSON.parse(data);
    }
    return {
      totalSessions: 0,
      totalMinutes: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activityMap: {},
      aiQueries: 0,
    };
  },

  saveStats: (stats: Stats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  getTheme: (): Theme => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as Theme) || 'light';
  },

  saveTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  isOnboarded: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
  },

  setOnboarded: () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
  },

  getNotes: (): string => {
    return localStorage.getItem(STORAGE_KEYS.NOTES) || '';
  },

  saveNotes: (notes: string) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, notes);
  },

  getCompletedTasks: (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    return data ? JSON.parse(data) : [];
  },

  saveCompletedTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
  },

  isWelcomeShown: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.WELCOME_SHOWN) === 'true';
  },

  setWelcomeShown: () => {
    localStorage.setItem(STORAGE_KEYS.WELCOME_SHOWN, 'true');
  },
};
