import React from 'react';
import { Twitter, Flame,Trophy,Zap } from 'lucide-react';

export default function StreakBox({ type,streak}) {

//   const streak = 26;
  const streakDevider = 30;

  const getStreakStyle = () => {
    if (streak >= 26) return { 
      textColor: 'text-indigo-200', 
      level: 'Epic',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />
    };
    if (streak >= 7) return { 
      textColor: 'text-blue-200', 
      level: 'Elite',
      icon: <Zap className="w-5 h-5 text-orange-500" />
    };
    return { 
      textColor: 'text-blue-300', 
      level: 'Fresh',
      icon: <Flame className="w-5 h-5 text-gray-100 " />
    };
  };



  const { textColor, level, icon } = getStreakStyle();

  const shareStreak = () => {
    const tweet = `I've maintained a ${streak}-day money tracking streak! #MoneyStreak #FinanceGoals https://financeget.vercel.app/`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-xl p-4 md:p-5 mb-4">
      {/* Original Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900" />
      {/* Subtle Wave Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,80 C30,60 70,40 100,60 L100,100 L0,100 Z" 
            fill="white" 
          />
        </svg>
      </div>

      <div className="relative flex flex-row justify-between items-start sm:items-center gap-4">
        {/* Streak Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* <Flame className={`w-5 h-5 ${textColor}`} /> */}
                {icon}
            <h3 className="text-lg font-medium text-white tracking-wide">
                Your Money Streak
            </h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tabular-nums">
              {streak}
            </span>
            <span className={`text-sm ${textColor} font-medium`}>
              {level}
            </span>
          </div>

          {/* Dynamic Message */}
          <p className="text-xs text-white opacity-85 max-w-[200px]">
            {streak === 0 
              ? "Ignite your tracking spark now!"
              : streak < 14 
                ? `Flowing strong! Elite in ${14 - streak} days`
                : streak < 30 
                  ? `Elite vibes! Epic in ${30 - streak} days`
                  : "Epic flow unlocked!"}
          </p>

          {/* Sleek Progress */}
          <div className="w-24 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className={`h-full ${textColor} bg-current transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min((streak / streakDevider) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={shareStreak}
          className="group inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-15 hover:bg-opacity-25 text-white text-sm rounded-xl transition-all duration-200"
        >
          <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />

          <span className="font-medium">Brag</span>
        </button>
      </div>
    </div>
  );
}