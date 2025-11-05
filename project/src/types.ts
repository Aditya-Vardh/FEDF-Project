export type Theme = 'light' | 'neon' | 'contrast';

export type ProductivityMethod = 'pomodoro' | 'eisenhower' | 'pareto' | 'timeblock' | 'goal' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  method: ProductivityMethod;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  deadline?: string;
  estimatedDuration?: number;
  eisenhowerQuadrant?: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  isPareto?: boolean;
  timeBlock?: { start: string; end: string };
  goalProgress?: number;
  goalMilestones?: Milestone[];
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  milestones: Milestone[];
  createdAt: string;
  completedAt?: string;
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  lastActiveDate: string;
  activityMap: Record<string, number>;
  aiQueries: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
