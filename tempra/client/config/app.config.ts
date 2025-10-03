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

export const NAVIGATION_LINKS = [
  { label: 'Features', href: '/features', hasDropdown: false },
  { label: 'Solutions', href: '#', hasDropdown: true },
  { label: 'Integrations', href: '/integrations', hasDropdown: false },
  { label: 'Pricing', href: '/pricing', hasDropdown: false },
  { label: 'Resources', href: '#', hasDropdown: true },
] as const;

export const EXTERNAL_LINKS = {
  signup: 'https://app.calento.ai/signup',
  login: 'https://app.calento.ai/login',
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
