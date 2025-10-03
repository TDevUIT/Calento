'use client';

import React from 'react';
import Link from 'next/link';
import { EXTERNAL_LINKS } from '@/config/app.config';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRight } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', hours: 6.5, tasks: 12 },
  { day: 'Tue', hours: 7.2, tasks: 15 },
  { day: 'Wed', hours: 5.8, tasks: 10 },
  { day: 'Thu', hours: 8.1, tasks: 18 },
  { day: 'Fri', hours: 7.5, tasks: 14 },
];

const stats = [
  { label: 'Focus time', value: '7.2h', subtext: 'daily avg' },
  { label: 'Tasks done', value: '69', subtext: 'this week' },
  { label: 'Efficiency', value: '94%', subtext: '+5% vs last' },
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
          <div className="border border-cod-gray-200 dark:border-cod-gray-700 rounded-lg p-6 bg-cod-gray-50/50 dark:bg-cod-gray-800/50 transition-colors duration-300">
            <h3 className="text-sm font-medium text-cod-gray-900 dark:text-cod-gray-100 mb-4 transition-colors duration-300">Weekly overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#4ECCA3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-cod-gray-200 dark:border-cod-gray-700 rounded-lg p-6 bg-cod-gray-50/50 dark:bg-cod-gray-800/50 transition-colors duration-300">
            <h3 className="text-sm font-medium text-cod-gray-900 dark:text-cod-gray-100 mb-4 transition-colors duration-300">Focus time trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ECCA3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ECCA3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#4ECCA3"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cod-gray-900 to-cod-gray-800 dark:from-cod-gray-800 dark:to-cod-gray-700 rounded-lg transition-colors duration-300">
          <div>
            <div className="text-white font-medium mb-1">Start tracking your productivity</div>
            <div className="text-cod-gray-400 dark:text-cod-gray-300 text-sm transition-colors duration-300">Join 10,000+ professionals optimizing their time</div>
          </div>
          <Link
            href={EXTERNAL_LINKS.signup}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4ECCA3] text-cod-gray-900 font-medium rounded-md hover:bg-[#3dd490] transition-colors text-sm shadow-md"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};