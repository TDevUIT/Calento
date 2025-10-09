export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  yearlyTotal?: string;
  description: string;
  features: string[];
  highlighted: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  savings?: string;
}

export interface PricingPlans {
  monthly: PricingPlan[];
  yearly: PricingPlan[];
}

export interface ComparisonFeature {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

export interface ComparisonCategory {
  category: string;
  features: ComparisonFeature[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export type BillingPeriod = 'monthly' | 'yearly';
