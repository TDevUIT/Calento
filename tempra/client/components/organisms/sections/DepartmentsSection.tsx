'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DEPARTMENTS_DATA } from '@/config/landing-data.config';
import { ArrowRight } from 'lucide-react';

export const DepartmentsSection: React.FC = () => {
  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-white via-cod-gray-50/50 to-white dark:from-cod-gray-950 dark:via-cod-gray-900/50 dark:to-cod-gray-950 relative overflow-hidden transition-colors duration-300" aria-labelledby="departments-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 transition-opacity duration-300">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#0c7057] dark:border-emerald-400 rounded-full transition-colors duration-300"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-[#0c7057] dark:border-emerald-400 rounded-full transition-colors duration-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#0c7057] dark:border-emerald-400 rounded-full transition-colors duration-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-[#0c7057] dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors duration-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>Tailored for Your Team</span>
          </div>
          
          <h2 id="departments-heading" className="text-4xl lg:text-5xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-6 leading-tight transition-colors duration-300">
            <span className="bg-gradient-to-r from-[#0c7057] to-[#0f8c6a] bg-clip-text text-transparent">
              Smart templates
            </span>{' '}
            for every team
          </h2>
          
          <p className="text-xl text-cod-gray-600 dark:text-cod-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            AI-powered productivity templates and focus time strategies customized for your role and industry
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DEPARTMENTS_DATA.map((dept) => (
            <Link
              key={dept.id}
              href={dept.href}
              className="bg-white dark:bg-cod-gray-800 border border-cod-gray-200 dark:border-cod-gray-700 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-cod-gray-950/30 transition-all duration-300 group"
              aria-label={`${dept.title}: ${dept.description}`}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <Image
                    src={dept.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-cod-gray-900 dark:text-cod-gray-100 transition-colors duration-300">
                  {dept.title}
                </h3>
                
                <p className="text-sm text-cod-gray-600 dark:text-cod-gray-400 leading-relaxed transition-colors duration-300">
                  Optimize workflows and boost productivity with AI-powered insights
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium text-[#0c7057] dark:text-emerald-400 group-hover:text-[#0a5d4a] dark:group-hover:text-emerald-300 transition-colors duration-300">
                  <span>Explore templates</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};