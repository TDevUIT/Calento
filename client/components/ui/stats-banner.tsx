'use client';

import React from 'react';

interface StatItem {
  readonly value: string;
  readonly label: string;
}

interface StatsBannerProps {
  stats: readonly StatItem[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
