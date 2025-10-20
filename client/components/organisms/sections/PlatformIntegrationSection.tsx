import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PLATFORM_INTEGRATIONS_DATA } from '@/config/landing-data.config';

export const PlatformIntegrationSection: React.FC = () => {
  if (PLATFORM_INTEGRATIONS_DATA.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-20 px-4 bg-cod-gray-50 dark:bg-cod-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLATFORM_INTEGRATIONS_DATA.map((platform) => (
            <Link
              key={platform.id}
              href={platform.href}
              className="bg-white dark:bg-cod-gray-800 rounded-2xl p-8 border border-cod-gray-200 dark:border-cod-gray-700 hover:shadow-lg dark:hover:shadow-cod-gray-950/30 transition-all duration-300 hover:border-[#4ECCA3] dark:hover:border-emerald-400 flex items-center gap-6 group"
            >
              <Image
                src={platform.logo}
                alt={`${platform.name} logo`}
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-2 transition-colors duration-300">{platform.name}</h3>
                <p className="text-cod-gray-600 dark:text-cod-gray-400 transition-colors duration-300">{platform.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
