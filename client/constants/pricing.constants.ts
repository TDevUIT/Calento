import { PricingPlans, ComparisonCategory, FAQ } from '@/types/pricing.types';

export const PRICING_PLANS: PricingPlans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started with AI scheduling",
      features: [
        "Up to 3 calendar connections",
        "Basic AI scheduling suggestions",
        "5 automated bookings per month",
        "Email notifications",
        "Mobile app access",
        "Community support"
      ],
      highlighted: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline"
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      yearlyPrice: "$9",
      description: "Ideal for professionals who need advanced scheduling features",
      features: [
        "Unlimited calendar connections",
        "Advanced AI scheduling & optimization",
        "Unlimited automated bookings",
        "Smart meeting room booking",
        "Calendar analytics & insights",
        "Priority email support",
        "Slack & Teams integration",
        "Custom availability rules",
        "Meeting templates"
      ],
      highlighted: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Advanced features for teams and organizations",
      features: [
        "Everything in Pro",
        "Team calendar management",
        "Advanced admin controls",
        "SSO & enterprise security",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom reporting",
        "SLA guarantee",
        "On-premise deployment"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started with AI scheduling",
      features: [
        "Up to 3 calendar connections",
        "Basic AI scheduling suggestions",
        "5 automated bookings per month",
        "Email notifications",
        "Mobile app access",
        "Community support"
      ],
      highlighted: false,
      buttonText: "Get Started Free",
      buttonVariant: "outline"
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      yearlyTotal: "$108/year",
      description: "Ideal for professionals who need advanced scheduling features",
      features: [
        "Unlimited calendar connections",
        "Advanced AI scheduling & optimization",
        "Unlimited automated bookings",
        "Smart meeting room booking",
        "Calendar analytics & insights",
        "Priority email support",
        "Slack & Teams integration",
        "Custom availability rules",
        "Meeting templates"
      ],
      highlighted: true,
      buttonText: "Start Pro Trial",
      buttonVariant: "default",
      savings: "Save 25%"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Advanced features for teams and organizations",
      features: [
        "Everything in Pro",
        "Team calendar management",
        "Advanced admin controls",
        "SSO & enterprise security",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom reporting",
        "SLA guarantee",
        "On-premise deployment"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline"
    }
  ]
};

export const COMPARISON_FEATURES: ComparisonCategory[] = [
  {
    category: "Calendar Management",
    features: [
      { name: "Calendar connections", free: "Up to 3", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "AI scheduling suggestions", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
      { name: "Automated bookings", free: "5/month", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Meeting room booking", free: false, pro: true, enterprise: true },
      { name: "Custom availability rules", free: false, pro: true, enterprise: true }
    ]
  },
  {
    category: "Integrations & Features",
    features: [
      { name: "Email notifications", free: true, pro: true, enterprise: true },
      { name: "Mobile app access", free: true, pro: true, enterprise: true },
      { name: "Slack & Teams integration", free: false, pro: true, enterprise: true },
      { name: "Calendar analytics", free: false, pro: true, enterprise: true },
      { name: "Meeting templates", free: false, pro: true, enterprise: true }
    ]
  },
  {
    category: "Support & Security",
    features: [
      { name: "Support", free: "Community", pro: "Priority email", enterprise: "24/7 priority" },
      { name: "SSO & enterprise security", free: false, pro: false, enterprise: true },
      { name: "Advanced admin controls", free: false, pro: false, enterprise: true },
      { name: "Custom integrations", free: false, pro: false, enterprise: true },
      { name: "SLA guarantee", free: false, pro: false, enterprise: true }
    ]
  }
];

export const PRICING_FAQS: FAQ[] = [
  {
    question: "Can I change my plan anytime?",
    answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle."
  },
  {
    question: "What calendar services do you support?",
    answer: "We support Google Calendar, Microsoft Outlook, Apple Calendar, and most popular calendar platforms through our universal sync technology."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption and security measures. Your calendar data is encrypted in transit and at rest."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. Contact support if you're not completely satisfied."
  },
  {
    question: "How does the AI scheduling work?",
    answer: "Our AI analyzes your calendar patterns, preferences, and availability to automatically suggest optimal meeting times and prevent scheduling conflicts."
  },
  {
    question: "Can I use it on mobile?",
    answer: "Yes! Tempra works seamlessly on all devices with native mobile apps for iOS and Android, plus a responsive web interface."
  }
];
