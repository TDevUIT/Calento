import { BASE_FE_URL } from "@/constants/routes";

export const APP_CONFIG = {
  name: 'Calento',
  tagline: 'Your AI-Powered Calendar Assistant',
  description: 'The smartest way to manage your time. Automatically schedule meetings, sync calendars, and get AI-powered suggestions to maximize your productivity.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  support: {
    email: 'support@calento.com',
    salesEmail: 'sales@calento.com',
  },
} as const;

export const BRAND_COLORS = {
  primary: '#4ECCA3',
  primaryLight: '#e0f7f0',
  secondary: '#10b981',
  secondaryDark: '#059669',
  accent: '#3b82f6',
  background: '#ffffff',
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
  },
} as const;

export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: readonly DropdownItem[];
}

export const NAVIGATION_LINKS: NavigationLink[] = [
  { 
    label: 'Features', 
    href: '/features', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'Calendar Sync', href: '/features/calendar-sync', description: 'Sync all your calendars in one place' },
      { label: 'Google Calendar Integration', href: '/integrations/google-calendar', description: 'Seamless Google Calendar integration' },
      { label: 'AI Scheduling', href: '/features/ai-scheduling', description: 'Smart AI-powered scheduling assistant' },
      { label: 'Time Management', href: '/features/time-management', description: 'Optimize your time with insights' }
    ]
  },
  { 
    label: 'Pricing', 
    href: '/pricing', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'Free Plan', href: '/pricing#free', description: 'Get started for free' },
      { label: 'Pro Plan', href: '/pricing#pro', description: 'For power users' },
      { label: 'Enterprise', href: '/pricing#enterprise', description: 'For teams and organizations' },
      { label: 'Compare Plans', href: '/pricing/compare', description: 'See all features side by side' }
    ]
  },
  { 
    label: 'Integrations', 
    href: '/integrations', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'Google Calendar', href: '/integrations/google-calendar', description: 'Connect Google Calendar' },
      { label: 'Outlook', href: '/integrations/outlook', description: 'Connect Microsoft Outlook' },
      { label: 'Slack', href: '/integrations/slack', description: 'Slack notifications & commands' },
      { label: 'Zoom', href: '/integrations/zoom', description: 'Auto-generate Zoom links' }
    ]
  },
  { 
    label: 'Company', 
    href: '/about', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'About', href: '/about', description: 'Learn about our mission' },
      { label: 'Contact', href: '/contact', description: 'Get in touch with us' },
      { label: 'Support', href: '/support', description: 'Get help when you need it' },
      { label: 'Careers', href: '/careers', description: 'Join our team' }
    ]
  },
  { 
    label: 'Resources', 
    href: '/docs', 
    hasDropdown: true,
    dropdownItems: [
      { label: 'Help Center', href: '/docs', description: 'Documentation and guides' },
      { label: 'Blog', href: '/blog', description: 'Latest news and updates' },
      { label: 'API Docs', href: '/api-docs', description: 'Developer documentation' },
      { label: 'Status', href: '/status', description: 'System status and uptime' }
    ]
  }
];

export const EXTERNAL_LINKS = {
  signup: `/auth/register`,
  login: `/auth/login`,
  contactSales: '/contact-sales',
  documentation: '/docs',
  support: '/support',
} as const;

export const INTEGRATIONS = {
  googleCalendar: {
    name: 'Google Calendar',
    icon: 'https://img.logo.dev/google.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=100&retina=true&format=png&theme=dark',
    color: '#4285F4',
  },
  outlook: {
    name: 'Outlook',
    icon: 'https://img.logo.dev/microsoft.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=100&retina=true&format=png&theme=dark',
    color: '#0078D4',
  },
  slack: {
    name: 'Slack',
    icon: 'https://img.logo.dev/slack.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=100&retina=true&format=png&theme=dark',
    color: '#4A154B',
  },
  zoom: {
    name: 'Linear',
    icon: 'https://www.logo.dev/customer-logos/linear.svg',
    color: '#2D8CFF',
  },
} as const;

export const FEATURES = {
  hero: {
    title: 'Your calendar, supercharged with AI',
    subtitle: 'The smartest way to manage your time. Let AI handle the complexity of scheduling while you focus on what matters most.',
    cta: {
      primary: 'Get started free',
      secondary: 'Watch demo',
      href: EXTERNAL_LINKS.signup,
    },
  },
  calendar: {
    smartScheduling: 'AI automatically finds the best meeting times',
    multiCalendar: 'Sync unlimited calendars in one view',
    insights: 'Get intelligent time management insights',
    automation: 'Automate repetitive scheduling tasks',
  },
} as const;

export const TRUSTED_COMPANIES = [
  { name: 'Google', logo: 'google' },
  { name: 'Microsoft', logo: 'microsoft' },
  { name: 'Slack', logo: 'slack' },
  { name: 'Zoom', logo: 'zoom' },
  { name: 'Notion', logo: 'notion' },
  { name: 'Asana', logo: 'asana' },
] as const;

export const SEO_KEYWORDS = [
  'AI calendar',
  'scheduling',
  'productivity',
  'time management',
  'Google Calendar',
  'Outlook',
  'calendar automation',
  'smart scheduling',
] as const;
