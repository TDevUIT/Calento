"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingPeriod } from "@/types/pricing.types";

interface PricingHeroProps {
  billingPeriod: BillingPeriod;
  onBillingPeriodChange: (period: BillingPeriod) => void;
}

export function PricingHero({ billingPeriod, onBillingPeriodChange }: PricingHeroProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex justify-center"
        >
          <Badge variant="secondary" className="border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            Simple, Transparent Pricing
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white"
        >
          Choose Your Plan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300"
        >
          Start free and scale as you grow. All plans include a 14-day free trial 
          of Pro features with no credit card required.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <Tabs value={billingPeriod} onValueChange={(value) => onBillingPeriodChange(value as BillingPeriod)} className="w-fit">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Yearly
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 text-xs">
                  Save 25%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
