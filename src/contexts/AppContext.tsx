import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Stats } from '../types';
import { storage } from '../utils/storage';
import { updateStreak } from '../utils/streakManager';

interface AppContextType {
  tasks: Task[];
  stats: Stats;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateStats: (updates: Partial<Stats>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(storage.getTasks());
  const [stats, setStats] = useState<Stats>(storage.getStats());

  useEffect(() => {
    const updatedStats = updateStreak(stats);
    if (updatedStats.streak !== stats.streak) {
      setStats(updatedStats);
      storage.saveStats(updatedStats);
    }
  }, []);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveStats(stats);
  }, [stats]);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateStats = (updates: Partial<Stats>) => {
    setStats((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ tasks, stats, addTask, updateTask, deleteTask, updateStats }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
