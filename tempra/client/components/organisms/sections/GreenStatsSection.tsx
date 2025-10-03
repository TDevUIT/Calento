import React from 'react';
import { STATS_DATA } from '@/config/landing-data.config';


export const GreenStatsSection: React.FC = () => {
  return (
    <section
      className="w-full py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20 transition-colors duration-300"
      aria-labelledby="green-stats-heading"
    >
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xl text-cod-gray-600 dark:text-cod-gray-400 mb-4 transition-colors duration-300">
          Reduce workplace stress, burnout, & turnover
        </p>
        <h2
          id="green-stats-heading"
          className="text-4xl lg:text-5xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-12 transition-colors duration-300"
        >
          Create a happier work culture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS_DATA.green.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-5xl font-bold text-[#0c7057] dark:text-emerald-400 mb-4 transition-colors duration-300" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </div>
              <div className="text-cod-gray-700 dark:text-cod-gray-300 text-lg leading-tight transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};