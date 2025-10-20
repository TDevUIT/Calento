import { APP_CONFIG, EXTERNAL_LINKS } from '@/config/app.config';

export interface FooterSectionData {
  title: string;
  links: FooterLinkData[];
  isWide?: boolean;
}

export interface FooterLinkData {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialPlatform {
  name: string;
  href: string;
  color: string;
  icon: React.ReactNode;
}

export const FOOTER_SECTIONS: FooterSectionData[] = [
  {
    title: "Features",
    links: [
      { label: "Calendar Sync", href: "/features/calendar-sync" },
      { label: "Google Calendar Integration", href: "/integrations/google-calendar" },
      { label: "AI Scheduling", href: "/features/ai-scheduling" },
      { label: "Time Management", href: "/features/time-management" }
    ]
  },
  {
    title: "Pricing",
    links: [
      { label: "Free Plan", href: "/pricing#free" },
      { label: "Pro Plan", href: "/pricing#pro" },
      { label: "Enterprise", href: "/pricing#enterprise" },
      { label: "Compare Plans", href: "/pricing/compare" }
    ]
  },
  {
    title: "Integrations",
    links: [
      { label: "Google Calendar", href: "/integrations/google-calendar" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: EXTERNAL_LINKS.support },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: EXTERNAL_LINKS.documentation },
      { label: "Blog", href: "/blog" },
      { label: "API Docs", href: "https://api.calento.space/docs#/" },
      { label: "Status", href: "/status" }
    ]
  }
];

export const SOCIAL_PLATFORMS: Omit<SocialPlatform, 'icon'>[] = [
  {
    name: "Twitter",
    href: "https://twitter.com/calento_ai",
    color: "hover:bg-[#1DA1F2] hover:text-white"
  },
  {
    name: "LinkedIn", 
    href: "https://linkedin.com/company/calento-ai",
    color: "hover:bg-[#0A66C2] hover:text-white"
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@calento-ai",
    color: "hover:bg-[#FF0000] hover:text-white"
  },
  {
    name: "Instagram",
    href: "https://instagram.com/calento.space",
    color: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white"
  },
  {
    name: "Facebook",
    href: "https://facebook.com/calento.space",
    color: "hover:bg-[#1877F2] hover:text-white"
  }
];

export const FOOTER_CTA = {
  badge: "READY TO DIVE IN?",
  title: "Boost your productivity.\nStart using our app today.",
  description: "Transform your calendar management with AI-powered scheduling. Connect Google Calendar and start optimizing your time today.",
  features: [
    "No-coding skills required",
    "Setup in minutes", 
    "14-day free trial"
  ],
  button: {
    text: `Get ${APP_CONFIG.name}`,
    href: EXTERNAL_LINKS.signup
  }
} as const;

export const REGISTER_CTA = {
  badge: "JOIN 10,000+ PROFESSIONALS",
  title: "See what Calento can do.\nExperience it yourself.",
  description: "Get a glimpse of how Calento helps you manage your calendar smarter. Join thousands of professionals who have reclaimed their time with AI-powered scheduling.",
  features: [
    "Free forever plan available",
    "No credit card required", 
    "Setup in under 2 minutes"
  ],
  button: {
    text: "View Live Dashboard",
    href: "/dashboard/preview"
  }
} as const;

export const FOOTER_BOTTOM = {
  copyright: `Â© ${new Date().getFullYear()} ${APP_CONFIG.name}. All rights reserved.`,
  email: APP_CONFIG.support.email,
  links: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" }
  ]
} as const;

export const FOOTER_BRAND = {
  description: `AI-powered calendar assistant helping professionals reclaim time and boost productivity`
} as const;
