'use client';

import React from 'react';

const companies = [
  'Google',
  'Microsoft',
  'Slack',
  'Zoom',
  'Notion',
  'Asana',
];

export const CompanyLogos: React.FC = () => {
  return (
    <div className="mt-12">
      <p className="text-sm font-medium text-gray-500 mb-6">Integrates with your favorite tools</p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {companies.map((company) => (
          <div 
            key={company} 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 font-semibold text-lg"
          >
            {company}
          </div>
        ))}
      </div>
    </div>
  );
};
