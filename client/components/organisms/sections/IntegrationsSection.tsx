"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { INTEGRATIONS_DATA } from '@/config/landing-data.config';
import type { IntegrationItem } from '@/types/landing.types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export const IntegrationsSection: React.FC = () => {
  return (
    <section className="w-full py-24 px-4 bg-slate-50 dark:bg-slate-950" aria-labelledby="integrations-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4ECCA3]/20 bg-[#4ECCA3]/10 px-4 py-2 text-sm font-medium text-[#4ECCA3] mb-6 dark:border-[#4ECCA3]/30 dark:bg-[#4ECCA3]/20">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Seamless Integrations</span>
          </div>
          <h2 id="integrations-heading" className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 dark:text-white">
            Integrate your work &
            <br />
            <span className="text-[#4ECCA3]">calendar</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Connect all your favorite productivity tools and keep everything in sync.
            <br />
            From task management to communication - we&apos;ve got you covered.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {(INTEGRATIONS_DATA as unknown as IntegrationItem[]).map((integration) => (
            <motion.div key={integration.id} variants={itemVariants}>
              <Link
                href={integration.href}
                className={`group relative block bg-white border border-slate-200/50 rounded-2xl p-6 text-center transition-all duration-500 ease-out  hover:border-[#4ECCA3]/50 hover:scale-105 dark:bg-slate-900 dark:border-slate-700/50 dark:hover:border-[#4ECCA3]/60 dark:hover:shadow-slate-900/30 ${
                  integration.comingSoon 
                    ? 'opacity-50 cursor-not-allowed pointer-events-none grayscale' 
                    : ''
                }`}
                aria-label={`${integration.name} integration: ${integration.description}`}
                {...(integration.comingSoon && { 'aria-disabled': 'true' as const })}
              >
                
                {integration.comingSoon && (
                  <div className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-medium px-2 py-1 rounded-full dark:bg-slate-400 dark:text-slate-900">
                    Soon
                  </div>
                )}

                <div className="relative z-10">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center transition-all duration-500 transform shadow-sm group-hover:shadow-lg">
                      <Image
                        src={integration.logo}
                        alt={`${integration.name} logo`}
                        width={28} 
                        height={28}
                        className="w-7 h-7 object-contain transition-all duration-500 group-hover:scale-125 group-hover:brightness-110"
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 mb-2 transition-all duration-300 dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed transition-colors duration-300">
                    {integration.description}
                  </p>

                  {!integration.comingSoon && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4ECCA3]/0 via-[#4ECCA3]/0 to-[#4ECCA3]/10 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};