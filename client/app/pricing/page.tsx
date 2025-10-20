"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingCard } from "@/components/pricing/PricingCard";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PRICING_PLANS, COMPARISON_FEATURES, PRICING_FAQS } from "@/constants/pricing.constants";
import { BillingPeriod } from "@/types/pricing.types";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<BillingPeriod>('monthly');
  const currentPlans = PRICING_PLANS[billingPeriod];

  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <PricingHero 
        billingPeriod={billingPeriod} 
        onBillingPeriodChange={setBillingPeriod}
      />

      <section className="bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-8 lg:grid-cols-3"
          >
            {currentPlans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                billingPeriod={billingPeriod}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <ComparisonTable categories={COMPARISON_FEATURES} />
      <PricingFAQ faqs={PRICING_FAQS} />
    </MainContent>
  );
}
