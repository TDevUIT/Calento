'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Insight {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const AIInsightsCard: React.FC = () => {
  const insights: Insight[] = [
    {
      icon: '⚡',
      title: 'Peak productivity time',
      description: 'You work best between 9-11 AM',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '🎯',
      title: 'Focus time protected',
      description: '2.5 hours saved this week',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: '📊',
      title: 'Meeting efficiency',
      description: '87% of meetings started on time',
      color: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">AI Insights</h3>
          <p className="text-sm text-purple-200">Your weekly summary</p>
        </div>
        <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/15 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className={cn('w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center text-xl flex-shrink-0', insight.color)}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                <p className="text-sm text-purple-200">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl font-medium transition-colors border border-white/20">
        View Full Report
      </button>
    </div>
  );
};
