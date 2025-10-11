"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingPlan, BillingPeriod } from "@/types/pricing.types";

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: BillingPeriod;
  index: number;
}

export function PricingCard({ plan, billingPeriod, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
      className="relative"
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <Card className={cn('h-full bg-white dark:bg-[#121212]', plan.highlighted ? 'border-blue-500 ring-1 ring-blue-500 shadow-lg' : 'border-slate-200 dark:border-slate-800')}>
        <CardContent className="p-8">
          <div className="mb-8">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {plan.name}
            </CardTitle>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-slate-500 dark:text-slate-400">
                  {plan.period}
                </span>
              )}
              {billingPeriod === 'yearly' && 'savings' in plan && plan.savings && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {plan.savings}
                </Badge>
              )}
            </div>
            {billingPeriod === 'yearly' && 'yearlyTotal' in plan && plan.yearlyTotal && (
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {plan.yearlyTotal}
              </div>
            )}
            <p className="text-slate-600 dark:text-slate-300">
              {plan.description}
            </p>
          </div>

          <div className="mb-8">
            <Button 
              variant={plan.buttonVariant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
              size="lg"
              className="w-full"
            >
              {plan.buttonText}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              What&apos;s included:
            </div>
            <ul className="space-y-3">
              {plan.features.map((feature: string, featureIndex: number) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
