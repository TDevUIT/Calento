'use client';

import React from 'react';
import { STATS_DATA } from '@/config/landing-data.config';

export const FocusStatsSection: React.FC = () => {
  return (
    <section
      className="relative w-full py-24 px-4 overflow-hidden bg-gradient-to-b from-white via-violet-50/30 to-white"
      aria-labelledby="focus-stats-heading"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Deleting meetings doesn't work – you need to prioritize focus time.
          </p>
          
          <h2 
            id="focus-stats-heading" 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            Tempra creates{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              395 hours
            </span>{' '}
            of focus time per user every year
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.focus.map((stat) => (
            <div 
              key={stat.id} 
              className="group relative p-8  transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl font-bold text-gray-900 mb-3 tracking-tight" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </div>
              
              <div className="text-gray-600 text-base font-medium leading-snug whitespace-pre-line">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};