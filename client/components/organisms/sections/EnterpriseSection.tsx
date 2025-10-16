import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ENTERPRISE_FEATURES_DATA } from '@/constants/landing.constants';
import type { EnterpriseFeature } from '@/interface/landing.interface';

export const EnterpriseSection: React.FC = () => {
  return (
    <section
      className="w-full py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
      aria-labelledby="enterprise-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-6">
          <h2 id="enterprise-heading" className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#0c7057] via-[#0f8c6a] to-[#0c7057] bg-clip-text text-transparent animate-gradient">
              Enterprise security, support &<br className="hidden md:block" />
              scalability
            </span>
          </h2>
          <Link
            href="https://trust.calento.space/"
            className="inline-block text-[#0c7057] hover:text-[#0f8c6a] font-semibold text-lg transition-colors hover:scale-105 transform duration-300"
          >
            Visit our trust center →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(ENTERPRISE_FEATURES_DATA as unknown as EnterpriseFeature[]).map((feature) => (
            <div
              key={feature.id}
              className="border border-gray-200 rounded-xl p-8 hover:shadow-md transition-all duration-300"
            >
              <Image
                src={feature.icon}
                alt={`${feature.title} icon`}
                width={32}
                height={32}
                className="w-8 h-8 mb-4 text-blue-600"
              />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};