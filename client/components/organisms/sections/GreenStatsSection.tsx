import React from 'react';
import { STATS_DATA } from '@/config/landing-data.config';
import { HeartPulse, Briefcase, ShieldCheck, Coffee } from 'lucide-react';

export const GreenStatsSection: React.FC = () => {
  const statIcons = [HeartPulse, Briefcase, ShieldCheck, Coffee] as const;

  return (
    <section
      className="w-full py-20 px-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 transition-colors duration-300"
      aria-labelledby="green-stats-heading"
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
            <span>Reduce workplace stress, burnout, & turnover</span>
          </div>
        </div>
        <h2
          id="green-stats-heading"
          className="text-4xl lg:text-5xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-12 transition-colors duration-300"
        >
          Create a happier work culture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS_DATA.green.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];

            return (
              <div
                key={stat.id}
                className="group text-left rounded-2xl border border-blue-200/60 bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-blue-900/30 dark:bg-slate-900/40"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div
                    className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 transition-colors duration-300"
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    {stat.value}
                  </div>
                </div>

                <div className="text-base font-medium leading-snug text-cod-gray-700 dark:text-cod-gray-200 transition-colors duration-300">
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
