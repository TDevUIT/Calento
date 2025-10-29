'use client';

import React from 'react';
import { STATS_DATA } from '@/config/landing-data.config';

export const FocusStatsSection: React.FC = () => {
  return (
    <section
      className="relative w-full py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-cod-gray-950 dark:via-blue-950/20 dark:to-cod-gray-950 transition-colors duration-300"
      aria-labelledby="focus-stats-heading"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none dark:hidden" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <p className="text-lg md:text-xl text-cod-gray-600 dark:text-cod-gray-400 max-w-3xl mx-auto font-medium transition-colors duration-300">
            Deleting meetings doesn&apos;t work — you need to prioritize focus time.
          </p>
          
          <h2 
            id="focus-stats-heading" 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-cod-gray-900 dark:text-white leading-tight transition-colors duration-300"
          >
            Calento creates{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              395 hours
            </span>{' '}
            of focus time per user every year
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.focus.map((stat) => (
            <div 
              key={stat.id} 
              className="group relative p-8 bg-white dark:bg-cod-gray-900 rounded-2xl border border-cod-gray-200 dark:border-cod-gray-700 transition-all duration-300 hover:border-blue-500/50"
            >
              <div className="text-5xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-3 tracking-tight transition-colors duration-300" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </div>
              
              <div className="text-cod-gray-600 dark:text-cod-gray-400 text-base font-medium leading-snug whitespace-pre-line transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
