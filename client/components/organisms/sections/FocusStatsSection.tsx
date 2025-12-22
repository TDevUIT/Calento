'use client';

import React from 'react';
import { STATS_DATA } from '@/config/landing-data.config';
import { Timer, CalendarX2, Clock, Shuffle } from 'lucide-react';

export const FocusStatsSection: React.FC = () => {
  const statIcons = [Timer, CalendarX2, Clock, Shuffle] as const;

  return (
    <section
      className="relative w-full py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-cod-gray-950 dark:via-blue-950/20 dark:to-cod-gray-950 transition-colors duration-300"
      aria-labelledby="focus-stats-heading"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none dark:hidden" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
              <span>Deleting meetings doesn&apos;t work — you need to prioritize focus time.</span>
            </div>
          </div>
          
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
          {STATS_DATA.focus.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];

            return (
              <div 
                key={stat.id} 
                className="group relative overflow-hidden rounded-2xl border border-cod-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md dark:border-cod-gray-800 dark:bg-cod-gray-900/60"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -inset-20 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10" />
                </div>

                <div className="relative mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-medium text-cod-gray-500 dark:text-cod-gray-400">Weekly impact</div>
                </div>

                <div className="relative text-5xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-3 tracking-tight transition-colors duration-300" aria-label={`${stat.value} ${stat.label}`}>
                  {stat.value}
                </div>
                
                <div className="relative text-cod-gray-600 dark:text-cod-gray-300 text-base font-medium leading-snug whitespace-pre-line transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
