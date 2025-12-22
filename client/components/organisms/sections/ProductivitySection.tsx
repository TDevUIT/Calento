'use client';

import React from 'react';
import Link from 'next/link';
import { AUTH_ROUTES } from '@/constants/routes';
import { ArrowRight, CheckCircle2, Timer, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Focus time', value: '7.2h', subtext: 'daily avg' },
  { label: 'Tasks done', value: '69', subtext: 'this week' },
  { label: 'Efficiency', value: '94%', subtext: '+5% vs last' },
];

const weeklyHighlights = [
  { day: 'Mon', label: 'Deep work blocks', value: '3', percent: 64 },
  { day: 'Tue', label: 'Meetings optimized', value: '5', percent: 78 },
  { day: 'Wed', label: 'Context switches', value: 'Low', percent: 52 },
  { day: 'Thu', label: 'Focus streak', value: '2h', percent: 92 },
  { day: 'Fri', label: 'Tasks completed', value: '14', percent: 81 },
];

const recommendations = [
  {
    icon: Timer,
    title: 'Protect focus time',
    description: 'Auto-block 2× 90-minute deep-work sessions each day.',
  },
  {
    icon: Sparkles,
    title: 'Smarter scheduling',
    description: 'Group meetings into 1–2 windows to reduce context switching.',
  },
  {
    icon: CheckCircle2,
    title: 'Finish more tasks',
    description: 'Turn tasks into time blocks and get reminders before deadlines.',
  },
];

export const ProductivitySection: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 bg-white dark:bg-cod-gray-950 dark:border-cod-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-cod-gray-900 dark:text-cod-gray-100 mb-3 transition-colors duration-300">
            Benchmark & optimize your productivity
          </h2>
          <p className="text-cod-gray-600 dark:text-cod-gray-400 max-w-xl transition-colors duration-300">
            Track your patterns, visualize progress, and work smarter with data-driven insights
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="border-l-2 border-cod-gray-200 dark:border-cod-gray-700 pl-4 transition-colors duration-300">
              <div className="text-xs uppercase text-cod-gray-500 dark:text-cod-gray-400 tracking-wide mb-1 transition-colors duration-300">{stat.label}</div>
              <div className="text-3xl font-semibold text-cod-gray-900 dark:text-cod-gray-100 transition-colors duration-300">{stat.value}</div>
              <div className="text-sm text-cod-gray-500 dark:text-cod-gray-400 mt-1 transition-colors duration-300">{stat.subtext}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="border border-cod-gray-200 dark:border-cod-gray-700 rounded-lg p-6 bg-white dark:bg-cod-gray-900 transition-all duration-300 hover:border-blue-500/50">
            <h3 className="text-sm font-medium text-cod-gray-900 dark:text-cod-gray-100 mb-4 transition-colors duration-300">Weekly overview</h3>
            <div className="space-y-3" role="list" aria-label="Weekly highlights">
              {weeklyHighlights.map((item) => (
                <div key={item.day} className="grid grid-cols-[40px_1fr_auto] items-center gap-3" role="listitem">
                  <div className="text-xs font-semibold text-cod-gray-700 dark:text-cod-gray-300">
                    {item.day}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-cod-gray-600 dark:text-cod-gray-400">
                        {item.label}
                      </div>
                      <div className="text-xs font-medium text-cod-gray-900 dark:text-cod-gray-100">
                        {item.value}
                      </div>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-cod-gray-100 dark:bg-cod-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${item.percent}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] tabular-nums text-cod-gray-500 dark:text-cod-gray-400">
                    {item.percent}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-cod-gray-200 dark:border-cod-gray-700 rounded-lg p-6 bg-white dark:bg-cod-gray-900 transition-all duration-300 hover:border-blue-500/50">
            <h3 className="text-sm font-medium text-cod-gray-900 dark:text-cod-gray-100 mb-4 transition-colors duration-300">Focus time trend</h3>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-cod-gray-200 dark:border-cod-gray-700 bg-cod-gray-50 dark:bg-cod-gray-950 px-4 py-3">
                  <div className="text-xs text-cod-gray-500 dark:text-cod-gray-400">Best day</div>
                  <div className="mt-1 font-semibold text-cod-gray-900 dark:text-cod-gray-100">Thursday</div>
                </div>
                <div className="rounded-md border border-cod-gray-200 dark:border-cod-gray-700 bg-cod-gray-50 dark:bg-cod-gray-950 px-4 py-3">
                  <div className="text-xs text-cod-gray-500 dark:text-cod-gray-400">Consistency</div>
                  <div className="mt-1 font-semibold text-cod-gray-900 dark:text-cod-gray-100">High</div>
                </div>
                <div className="rounded-md border border-cod-gray-200 dark:border-cod-gray-700 bg-cod-gray-50 dark:bg-cod-gray-950 px-4 py-3">
                  <div className="text-xs text-cod-gray-500 dark:text-cod-gray-400">Suggested change</div>
                  <div className="mt-1 font-semibold text-cod-gray-900 dark:text-cod-gray-100">+30m/day</div>
                </div>
              </div>

              <div className="rounded-lg border border-cod-gray-200 dark:border-cod-gray-700 bg-white dark:bg-cod-gray-950 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-medium text-cod-gray-900 dark:text-cod-gray-100">Recommended next steps</div>
                  <div className="text-[11px] text-cod-gray-500 dark:text-cod-gray-400">Personalized insights</div>
                </div>
                <div className="grid gap-3">
                  {recommendations.map((rec) => (
                    <div key={rec.title} className="flex items-start gap-3 rounded-md border border-cod-gray-200 dark:border-cod-gray-800 px-3 py-3">
                      <rec.icon aria-hidden="true" className="mt-0.5 h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-semibold text-cod-gray-900 dark:text-cod-gray-100">{rec.title}</div>
                        <div className="text-xs text-cod-gray-600 dark:text-cod-gray-400">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-6 border border-cod-gray-200 dark:border-cod-gray-700 bg-cod-gray-50 dark:bg-cod-gray-900 rounded-lg transition-all duration-300">
          <div>
            <div className="text-cod-gray-900 dark:text-white font-semibold mb-1">Start tracking your productivity</div>
            <div className="text-cod-gray-600 dark:text-cod-gray-400 text-sm transition-colors duration-300">Join 10,000+ professionals optimizing their time</div>
          </div>
          <Link
            href={AUTH_ROUTES.REGISTER}
            className="inline-flex items-center gap-2 px-5 py-2.5 theme-btn-primary font-medium rounded-md transition-all text-sm"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
