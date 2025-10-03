'use client';

import React from 'react';

interface TimerCardProps {
  project: string;
  task: string;
  time: string;
}

export const TimerCard: React.FC<TimerCardProps> = ({ project, task, time }) => {
  return (
    <div className="bg-gradient-to-br from-purple-300 to-pink-200 rounded-2xl p-4 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">
            {project}
          </p>
          <h3 className="text-base font-medium text-gray-900">{task}</h3>
        </div>
        <span className="text-xs text-purple-800">TUE, 30 AUG</span>
      </div>
      
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-3">
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M0 0H4V14H0V0ZM8 0H12V14H8V0Z" fill="#1F2937"/>
            </svg>
          </button>
          <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect width="10" height="10" fill="white"/>
            </svg>
          </button>
        </div>
        
        <span className="text-2xl font-bold text-gray-900">{time}</span>
      </div>
    </div>
  );
};
