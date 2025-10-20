import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TIMELINE_DATA } from '@/config/landing-data.config';
import { EXTERNAL_LINKS } from '@/config/app.config';

export const ThirtyDaySection: React.FC = () => {
  return (
        <section className="w-full py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient(at 90% 50%, rgba(85, 98, 235, 0.1) 0%, rgba(226, 233, 255, 0.05) 100%) animate-pulse-slow" />
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4">
                        Boost productivity on day 1
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {TIMELINE_DATA.map((phase) => (
                        <div key={phase.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="text-center mb-6">
                                <div className={cn('text-2xl font-bold', phase.period === "Day 30" ? "text-blue-600" : "text-gray-900")}>
                                    {phase.period}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {phase.items.map((item, itemIndex) => (
                                    <div key={`${phase.id}-item-${itemIndex}`} className="flex items-start gap-3">
                                        <Image
                                            src="https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/689e51fe2f2b1d7ec2068891_green_check.svg"
                                            alt="Checkmark"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={EXTERNAL_LINKS.signup}
                            className="theme-btn-primary px-8 py-4 rounded-full font-semibold transition-colors text-lg shadow-md hover:shadow-lg"
                        >
                            Create your free account
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-600 font-semibold hover:text-gray-800 transition-colors text-lg"
                        >
                            Explore a pilot
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
