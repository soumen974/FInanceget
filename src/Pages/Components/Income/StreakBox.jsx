import React from 'react';
import { Twitter, Flame, Trophy, Zap } from 'lucide-react';

export default function StreakBox({ type,streak,  shareGains }) {
  // const streak = 27;
  const streakDevider = 30;

  const getStreakLevel = () => {
    if (streak >= 26) return { text: 'Master', color: 'text-yellow-500', icon: <Trophy className="w-5 h-5 text-yellow-500" /> };
    if (streak >= 7) return { text: 'Pro', color: 'text-orange-500', icon: <Zap className="w-5 h-5 text-orange-500" /> };
    return { text: 'Starter', color: 'text-gray-100', icon: <Flame className="w-5 h-5 text-gray-900 dark:text-gray-100 " /> };
  };

  const streakLevel = getStreakLevel();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-[#0a0a0a] dark:to-indigo-950 rounded-xl p-6 mb-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-900 rounded-full -mr-16 -mt-16 opacity-20" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Streak Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>{streakLevel.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {type === 'income' ? 'Income' : 'Expense'} Tracking Streak
            </h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {streak}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">days</span>
            <span className={`text-sm font-medium ${streakLevel.color}`}>
              ({streakLevel.text} Level)
            </span>
          </div>

          {/* Motivation Message */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {streak === 0 
              ? "Start tracking today to build your streak!"
              : streak < 7 
                ? "Keep going to reach Pro status!"
                : streak < 26 
                  ? "Amazing progress! Master level awaits!"
                  : "You're a tracking champion!"}
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-[200px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{ width: `${Math.min((streak / streakDevider) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={shareGains}
          className="group relative inline-flex items-center gap-2 px-3 sm:px-6 p-2 sm:py-3 bg-indigo-600 text-white text-[0.8rem] sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          <span>Share Your Streak</span>
          <Twitter className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
        </button>
      </div>

      {/* Streak Milestones */}
      <div className="mt-4 flex gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Next milestone:</span>
        <span className={streak < 14 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>
          14 days (Pro)
        </span>
        <span className={streak >= 14 && streak < 30 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>
          30 days (Master)
        </span>
      </div>
    </div>
  );
}