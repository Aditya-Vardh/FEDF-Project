import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Clock, Grid, TrendingUp, Calendar, Target, X, CheckCircle, Trophy, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Task, ProductivityMethod, Milestone } from '../types';
import { Timer } from '../components/Timer';
import { Mascot } from '../components/Mascot';
import { triggerConfetti } from '../utils/confetti';
import { storage } from '../utils/storage';

export const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  const [completedTasks, setCompletedTasks] = useState<Task[]>(storage.getCompletedTasks());
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterMethod, setFilterMethod] = useState<ProductivityMethod | 'all'>('all');
  const [showTimer, setShowTimer] = useState(false);
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    method: 'none' as ProductivityMethod,
    deadline: '',
    estimatedDuration: 30,
    eisenhowerQuadrant: 'not-urgent-important' as Task['eisenhowerQuadrant'],
    isPareto: false,
    timeBlock: { start: '', end: '' },
    goalProgress: 0,
    goalMilestones: [{ id: Date.now().toString(), text: '', completed: false }] as Milestone[],
  });

  const methodIcons = {
    pomodoro: Clock,
    eisenhower: Grid,
    pareto: TrendingUp,
    timeblock: Calendar,
    goal: Target,
    none: X,
  };

  const methodColors = {
    pomodoro: 'from-red-500 to-orange-500',
    eisenhower: 'from-blue-500 to-purple-500',
    pareto: 'from-green-500 to-teal-500',
    timeblock: 'from-yellow-500 to-orange-500',
    goal: 'from-pink-500 to-rose-500',
    none: 'from-gray-500 to-gray-600',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      method: formData.method,
      completed: editingTask?.completed || false,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      deadline: formData.deadline,
      estimatedDuration: formData.estimatedDuration,
      ...(formData.method === 'eisenhower' && { eisenhowerQuadrant: formData.eisenhowerQuadrant }),
      ...(formData.method === 'pareto' && { isPareto: formData.isPareto }),
      ...(formData.method === 'timeblock' && { timeBlock: formData.timeBlock }),
      ...(formData.method === 'goal' && {
        goalProgress: formData.goalProgress,
        goalMilestones: formData.goalMilestones.filter(m => m.text.trim()),
      }),
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      method: 'none',
      deadline: '',
      estimatedDuration: 30,
      eisenhowerQuadrant: 'not-urgent-important',
      isPareto: false,
      timeBlock: { start: '', end: '' },
      goalProgress: 0,
      goalMilestones: [{ id: Date.now().toString(), text: '', completed: false }],
    });
    setEditingTask(null);
    setShowModal(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      method: task.method,
      deadline: task.deadline || '',
      estimatedDuration: task.estimatedDuration || 30,
      eisenhowerQuadrant: task.eisenhowerQuadrant || 'not-urgent-important',
      isPareto: task.isPareto || false,
      timeBlock: task.timeBlock || { start: '', end: '' },
      goalProgress: task.goalProgress || 0,
      goalMilestones: task.goalMilestones || [{ id: Date.now().toString(), text: '', completed: false }],
    });
    setShowModal(true);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() };
      const newCompletedTasks = [...completedTasks, completedTask];
      setCompletedTasks(newCompletedTasks);
      storage.saveCompletedTasks(newCompletedTasks);
      deleteTask(taskId);
      triggerConfetti();
    }
  };

  const restoreTask = (taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (task) {
      addTask({ ...task, completed: false, completedAt: undefined });
      const newCompletedTasks = completedTasks.filter(t => t.id !== taskId);
      setCompletedTasks(newCompletedTasks);
      storage.saveCompletedTasks(newCompletedTasks);
    }
  };

  const deleteCompletedTask = (taskId: string) => {
    const newCompletedTasks = completedTasks.filter(t => t.id !== taskId);
    setCompletedTasks(newCompletedTasks);
    storage.saveCompletedTasks(newCompletedTasks);
  };

  const startTimer = (task: Task) => {
    setTimerTask(task);
    setShowTimer(true);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const filteredTasks = filterMethod === 'all'
    ? activeTasks
    : activeTasks.filter(t => t.method === filterMethod);

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const todayCompleted = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().toISOString().split('T')[0];
    const completedDate = new Date(t.completedAt).toISOString().split('T')[0];
    return today === completedDate;
  }).length;

  const weekCompleted = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.completedAt) >= weekAgo;
  }).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-theme-text mb-2">Tasks</h1>
          <p className="text-theme-text-secondary">Manage your productivity with proven methods</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              showCompleted
                ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                : 'bg-theme-card border border-theme-border text-theme-text'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Completed
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </motion.button>
        </div>
      </div>

      {!showCompleted ? (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterMethod('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filterMethod === 'all'
                  ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                  : 'bg-theme-card border border-theme-border text-theme-text'
              }`}
            >
              All
            </button>
            {Object.keys(methodIcons).filter(m => m !== 'none').map((method) => {
              const Icon = methodIcons[method as ProductivityMethod];
              return (
                <button
                  key={method}
                  onClick={() => setFilterMethod(method as ProductivityMethod)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                    filterMethod === method
                      ? 'bg-gradient-to-r from-theme-primary to-theme-secondary text-white'
                      : 'bg-theme-card border border-theme-border text-theme-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTasks.map((task) => {
                const MethodIcon = methodIcons[task.method];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="bg-theme-card border border-theme-border rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`bg-gradient-to-br ${methodColors[task.method]} p-2 rounded-lg flex-shrink-0`}>
                          <MethodIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-theme-text truncate">{task.title}</h3>
                          <p className="text-xs text-theme-text-secondary capitalize">{task.method}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`}></div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-theme-text-secondary mb-3 line-clamp-2">{task.description}</p>
                    )}

                    {task.deadline && (
                      <div className="flex items-center gap-2 text-xs text-theme-text-secondary mb-3">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    {task.method === 'goal' && task.goalProgress !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-theme-text-secondary mb-1">
                          <span>Progress</span>
                          <span>{task.goalProgress}%</span>
                        </div>
                        <div className="h-2 bg-theme-hover rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${task.goalProgress}%` }}
                            className="h-full bg-gradient-to-r from-theme-primary to-theme-secondary"
                          />
                        </div>
                      </div>
                    )}

                    {task.method === 'timeblock' && task.timeBlock && (
                      <p className="text-xs text-theme-text-secondary mb-4">
                        {task.timeBlock.start} - {task.timeBlock.end}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {task.method === 'pomodoro' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startTimer(task)}
                          className="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Start Timer
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => completeTask(task.id)}
                        className="p-2 bg-green-500/20 text-green-500 rounded-lg"
                        title="Complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(task)}
                        className="p-2 bg-theme-hover rounded-lg text-theme-text"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteTask(task.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div>
          <div className="bg-theme-card border border-theme-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h2 className="text-2xl font-bold text-theme-text">Completed Quests 🏆</h2>
                <p className="text-sm text-theme-text-secondary">Nice work! Another one bites the dust 😎</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-theme-hover rounded-xl p-4">
                <p className="text-2xl font-bold text-theme-text">{todayCompleted}</p>
                <p className="text-xs text-theme-text-secondary">Completed Today</p>
              </div>
              <div className="bg-theme-hover rounded-xl p-4">
                <p className="text-2xl font-bold text-theme-text">{weekCompleted}</p>
                <p className="text-xs text-theme-text-secondary">Completed This Week</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {completedTasks.map((task) => {
                const MethodIcon = methodIcons[task.method];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-theme-card border-2 border-green-500/50 rounded-xl p-6 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`bg-gradient-to-br ${methodColors[task.method]} p-2 rounded-lg`}>
                        <MethodIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-theme-text truncate">{task.title}</h3>
                        <p className="text-xs text-theme-text-secondary capitalize">{task.method}</p>
                      </div>
                    </div>

                    {task.completedAt && (
                      <p className="text-xs text-green-500 mb-3">
                        ✓ Completed {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => restoreTask(task.id)}
                        className="flex-1 bg-theme-hover text-theme-text px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteCompletedTask(task.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-theme-card border border-theme-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-theme-text mb-6">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-theme-text mb-2">
                    Task Name / Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter task title"
                    className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-text mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add task description (optional)"
                    rows={3}
                    className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">
                      Priority *
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <motion.button
                          key={priority}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({ ...formData, priority })}
                          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                            formData.priority === priority
                              ? `${getPriorityColor(priority)} text-white shadow-lg`
                              : 'bg-theme-hover text-theme-text border-2 border-theme-border'
                          }`}
                        >
                          {getPriorityLabel(priority)}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">
                      Method *
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as ProductivityMethod })}
                      className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                    >
                      <option value="none">None</option>
                      <option value="pomodoro">Pomodoro</option>
                      <option value="eisenhower">Eisenhower Matrix</option>
                      <option value="pareto">Pareto Principle</option>
                      <option value="timeblock">Time Blocking</option>
                      <option value="goal">Goal Tracking</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">
                      Estimated Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {formData.method === 'eisenhower' && (
                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">Quadrant</label>
                    <select
                      value={formData.eisenhowerQuadrant}
                      onChange={(e) => setFormData({ ...formData, eisenhowerQuadrant: e.target.value as any })}
                      className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                    >
                      <option value="urgent-important">Urgent & Important</option>
                      <option value="not-urgent-important">Not Urgent & Important</option>
                      <option value="urgent-not-important">Urgent & Not Important</option>
                      <option value="not-urgent-not-important">Not Urgent & Not Important</option>
                    </select>
                  </div>
                )}

                {formData.method === 'pareto' && (
                  <div className="flex items-center gap-3 p-4 bg-theme-hover rounded-xl">
                    <input
                      type="checkbox"
                      checked={formData.isPareto}
                      onChange={(e) => setFormData({ ...formData, isPareto: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label className="text-sm text-theme-text font-medium">Mark as top 20% high-impact task</label>
                  </div>
                )}

                {formData.method === 'timeblock' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-theme-text mb-2">Start Time</label>
                      <input
                        type="time"
                        value={formData.timeBlock.start}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeBlock: { ...formData.timeBlock, start: e.target.value }
                        })}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-theme-text mb-2">End Time</label>
                      <input
                        type="time"
                        value={formData.timeBlock.end}
                        onChange={(e) => setFormData({
                          ...formData,
                          timeBlock: { ...formData.timeBlock, end: e.target.value }
                        })}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-theme-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {formData.method === 'goal' && (
                  <div>
                    <label className="block text-sm font-semibold text-theme-text mb-2">
                      Progress ({formData.goalProgress}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.goalProgress}
                      onChange={(e) => setFormData({ ...formData, goalProgress: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-4 bg-theme-hover rounded-xl text-theme-text font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Modal */}
      <AnimatePresence>
        {showTimer && timerTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTimer(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-theme-card border border-theme-border rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-theme-text mb-2 text-center">{timerTask.title}</h2>
              <p className="text-theme-text-secondary text-center mb-8">Stay focused!</p>
              <Timer />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTimer(false)}
                className="w-full mt-6 px-6 py-3 bg-theme-hover rounded-xl text-theme-text"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Mascot mode="idle" />
    </div>
  );
};
