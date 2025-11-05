import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Circle, Trophy, Calendar } from 'lucide-react';
import { Goal, Milestone } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { storage } from '../utils/storage';

export const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('focusquest_goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    milestones: [{ id: Date.now().toString(), text: '', completed: false }],
  });

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem('focusquest_goals', JSON.stringify(newGoals));
  };

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { id: Date.now().toString(), text: '', completed: false },
      ],
    });
  };

  const removeMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((m) => m.id !== id),
    });
  };

  const updateMilestoneText = (id: string, text: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.map((m) =>
        m.id === id ? { ...m, text } : m
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      deadline: formData.deadline,
      milestones: formData.milestones.filter((m) => m.text.trim()),
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, newGoal]);
    setFormData({
      title: '',
      deadline: '',
      milestones: [{ id: Date.now().toString(), text: '', completed: false }],
    });
    setShowModal(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = (completedCount / updatedMilestones.length) * 100;

        if (progress === 100 && !goal.completedAt) {
          triggerConfetti();
          setTimeout(() => {
            alert('Mission Complete! 🏆 Great job, hero!');
          }, 500);
          return {
            ...goal,
            milestones: updatedMilestones,
            completedAt: new Date().toISOString(),
          };
        }

        return { ...goal, milestones: updatedMilestones };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const getProgress = (goal: Goal) => {
    if (goal.milestones.length === 0) return 0;
    const completed = goal.milestones.filter((m) => m.completed).length;
    return (completed / goal.milestones.length) * 100;
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-theme-text mb-2">Goal Tracker</h1>
          <p className="text-theme-text-secondary">Set milestones and achieve greatness</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence>
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-theme-card border-2 rounded-2xl p-6 shadow-lg ${
                  goal.completedAt
                    ? 'border-green-500'
                    : 'border-theme-border'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-theme-text mb-2">
                      {goal.title}
                      {goal.completedAt && (
                        <Trophy className="inline ml-2 w-5 h-5 text-yellow-500" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : daysLeft === 0
                          ? 'Due today'
                          : 'Overdue'}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 bg-red-500/20 text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-theme-text-secondary mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-theme-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-theme-primary to-theme-secondary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      whileHover={{ x: 4 }}
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                      className="flex items-center gap-3 p-3 bg-theme-hover rounded-lg cursor-pointer transition-colors hover:bg-theme-border"
                    >
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-theme-text-secondary flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          milestone.completed
                            ? 'line-through text-theme-text-secondary'
                            : 'text-theme-text'
                        }`}
                      >
                        {milestone.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-theme-card border border-theme-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-theme-text mb-6">Create New Goal</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Master React Development"
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-4 py-2 text-theme-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-4 py-2 text-theme-text"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-theme-text">
                      Milestones
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addMilestone}
                      className="text-sm text-theme-primary flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Milestone
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {formData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex gap-2">
                        <input
                          type="text"
                          value={milestone.text}
                          onChange={(e) => updateMilestoneText(milestone.id, e.target.value)}
                          placeholder={`Milestone ${index + 1}`}
                          className="flex-1 bg-theme-bg border border-theme-border rounded-lg px-4 py-2 text-theme-text"
                        />
                        {formData.milestones.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeMilestone(milestone.id)}
                            className="p-2 bg-red-500/20 text-red-500 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-6 py-3 rounded-xl"
                  >
                    Create Goal
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-theme-hover rounded-xl text-theme-text"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
