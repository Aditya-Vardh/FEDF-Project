import { motion } from 'framer-motion';

interface HeatmapProps {
  activityMap: Record<string, number>;
}

export const Heatmap = ({ activityMap }: HeatmapProps) => {
  const getColor = (minutes: number): string => {
    if (minutes === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (minutes < 30) return 'bg-green-200 dark:bg-green-900';
    if (minutes < 60) return 'bg-green-400 dark:bg-green-700';
    if (minutes < 120) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  const getLast90Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        minutes: activityMap[dateStr] || 0,
      });
    }
    return days;
  };

  const days = getLast90Days();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                whileHover={{ scale: 1.2 }}
                className={`w-3 h-3 rounded-sm ${getColor(day.minutes)} cursor-pointer`}
                title={`${day.date}: ${day.minutes} minutes`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-theme-text-secondary">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-800 dark:bg-green-300 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
