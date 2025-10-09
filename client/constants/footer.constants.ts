import { APP_CONFIG, EXTERNAL_LINKS } from '@/config/app.config';

// Footer Section Types
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

// Footer Sections Configuration
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
      { label: "Outlook", href: "/integrations/outlook" },
      { label: "Slack", href: "/integrations/slack" },
      { label: "Zoom", href: "/integrations/zoom" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: EXTERNAL_LINKS.support },
      { label: "Careers", href: "/careers" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: EXTERNAL_LINKS.documentation },
      { label: "Blog", href: "/blog" },
      { label: "API Docs", href: "/api-docs" },
      { label: "Status", href: "/status" }
    ]
  }
];

// Social Media Platforms
export const SOCIAL_PLATFORMS: Omit<SocialPlatform, 'icon'>[] = [
  {
    name: "Twitter",
    href: "https://twitter.com/tempra_ai",
    color: "hover:bg-[#1DA1F2] hover:text-white"
  },
  {
    name: "LinkedIn", 
    href: "https://linkedin.com/company/tempra-ai",
    color: "hover:bg-[#0A66C2] hover:text-white"
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@tempra-ai",
    color: "hover:bg-[#FF0000] hover:text-white"
  },
  {
    name: "Instagram",
    href: "https://instagram.com/tempra.ai",
    color: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white"
  },
  {
    name: "Facebook",
    href: "https://facebook.com/tempra.ai",
    color: "hover:bg-[#1877F2] hover:text-white"
  }
];

// Footer CTA Configuration
export const FOOTER_CTA = {
  badge: {
    text: "READY TO DIVE IN?",
    className: "text-xs font-semibold text-blue-200 mb-3 tracking-wider uppercase"
  },
  title: {
    text: "Boost your productivity.\nStart using our app today.",
    className: "text-2xl lg:text-3xl font-bold mb-4 leading-tight"
  },
  description: {
    text: "Transform your calendar management with AI-powered scheduling. Connect Google Calendar and start optimizing your time today.",
    className: "text-blue-100 mb-6 text-base leading-relaxed"
  },
  features: [
    "No-coding skills required",
    "Setup in minutes", 
    "14-day free trial"
  ],
  button: {
    text: `Get ${APP_CONFIG.name}`,
    href: EXTERNAL_LINKS.signup,
    className: "bg-white text-blue-700 px-6 py-3 rounded-full font-semibold text-base hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
  }
} as const;

// Footer Bottom Configuration
export const FOOTER_BOTTOM = {
  copyright: `© ${new Date().getFullYear()} ${APP_CONFIG.name}. All rights reserved.`,
  email: APP_CONFIG.support.email,
  links: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" }
  ]
} as const;

// Footer Brand Configuration
export const FOOTER_BRAND = {
  description: `AI-powered calendar assistant helping professionals reclaim time and boost productivity`,
  className: "text-cod-gray-700 dark:text-cod-gray-300 mb-6 font-medium transition-colors duration-300 text-sm leading-relaxed"
} as const;
