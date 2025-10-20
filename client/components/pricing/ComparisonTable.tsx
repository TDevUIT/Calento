"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ComparisonCategory } from "@/types/pricing.types";

interface ComparisonTableProps {
  categories: ComparisonCategory[];
}

export function ComparisonTable({ categories }: ComparisonTableProps) {
  const renderFeatureCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="h-5 w-5 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-slate-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    return <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>;
  };

  return (
    <section className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Compare Plans
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Choose the plan that fits your needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="space-y-8"
        >
          {categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-white dark:bg-[#121212] border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          Feature
                        </th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          Free
                        </th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          Pro
                        </th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className={featureIndex !== category.features.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}>
                          <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                            {feature.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureCell(feature.free)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureCell(feature.pro)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {renderFeatureCell(feature.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
