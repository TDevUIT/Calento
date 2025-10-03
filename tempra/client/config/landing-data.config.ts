export const STATS_DATA = {
  green: [
    { id: 'green-stat-1', value: '56%', label: 'less burnout for employees' },
    { id: 'green-stat-2', value: '45%', label: 'better work-life balance for employees' },
    { id: 'green-stat-3', value: '63%', label: 'less work stress for employees' },
    { id: 'green-stat-4', value: '2.9', label: 'more lunch breaks/week enjoyed by employees' },
  ],
  focus: [
    { id: 'focus-stat-1', value: '7.6', label: 'more focus time\nhours/week' },
    { id: 'focus-stat-2', value: '2.3', label: 'fewer unnecessary\nmeetings/week' },
    { id: 'focus-stat-3', value: '4.5', label: 'fewer overtime\nhours/week' },
    { id: 'focus-stat-4', value: '60%', label: 'less unproductive\ncontext switching' },
  ],
} as const;

export const DEPARTMENTS_DATA = [
  {
    id: 'dept-marketing',
    title: 'Marketing',
    description: 'Fast-track campaigns →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf61e_marketing_180.svg',
    colorClass: 'bg-purple-600 text-white',
    href: '/teams/marketing',
  },
  {
    id: 'dept-engineering',
    title: 'Engineering',
    description: 'Get more coding done →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf620_engineering_180.svg',
    colorClass: 'bg-blue-800 text-white',
    href: '/teams/engineering',
  },
  {
    id: 'dept-product',
    title: 'Product',
    description: 'Ship product faster →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf621_product_180.svg',
    colorClass: 'bg-blue-100 text-gray-900',
    href: '/teams/product',
  },
  {
    id: 'dept-sales',
    title: 'Sales',
    description: 'Close more deals →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf624_sales_180.svg',
    colorClass: 'bg-white text-gray-900 border border-gray-200',
    href: '/teams/sales',
  },
  {
    id: 'dept-hr',
    title: 'HR',
    description: 'Empower employees →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf625_hr_180.svg',
    colorClass: 'bg-green-100 text-gray-900',
    href: '/teams/hr',
  },
  {
    id: 'dept-finance',
    title: 'Finance',
    description: 'Improve performance →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf626_finance_180.svg',
    colorClass: 'bg-green-200 text-gray-900',
    href: '/teams/finance',
  },
  {
    id: 'dept-ea',
    title: 'EAs & Admin',
    description: 'Optimize your work →',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/68228a8dbdfab58f722be1c9_ea_card_01.svg',
    colorClass: 'bg-green-800 text-white',
    href: '/teams/executive-assistants',
  },
] as const;

export const INTEGRATIONS_DATA = [
  {
    id: 'int-slack',
    name: 'Slack',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccef29_slack.svg',
    description: 'Sync your Slack status',
    href: 'https://reclaim.ai/integrations/slack',
  },
  {
    id: 'int-zoom',
    name: 'Zoom',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf2cf_zoomus-icon%20(1).svg',
    description: 'Connect to Zoom',
    href: 'https://reclaim.ai/integrations/zoom',
  },
  {
    id: 'int-gtasks',
    name: 'Google Tasks',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf16a_google-tasks-icon.svg',
    description: 'Integrate Google Tasks',
    href: 'https://reclaim.ai/integrations/google-tasks',
  },
  {
    id: 'int-clickup',
    name: 'ClickUp',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf181_clickup.svg',
    description: 'Integrate ClickUp Tasks',
    href: 'https://reclaim.ai/integrations/clickup',
  },
  {
    id: 'int-todoist',
    name: 'Todoist',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf16e_todoist.svg',
    description: 'Integrate Todoist tasks',
    href: 'https://reclaim.ai/integrations/todoist',
  },
  {
    id: 'int-jira',
    name: 'Jira',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf182_jira.svg',
    description: 'Integrate Jira tasks',
    href: 'https://reclaim.ai/integrations/jira',
  },
  {
    id: 'int-asana',
    name: 'Asana',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf2d0_asana.svg',
    description: 'Integrate Asana tasks',
    href: 'https://reclaim.ai/integrations/asana',
  },
  {
    id: 'int-linear',
    name: 'Linear',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf171_linear-icon.svg',
    description: 'Integrate Linear tasks',
    href: 'https://reclaim.ai/integrations/linear',
  },
  {
    id: 'int-webhooks',
    name: 'Webhooks',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf8e5_webhooks.svg',
    description: 'Automate webhooks',
    href: 'https://reclaim.ai/features/scheduling-links',
  },
  {
    id: 'int-raycast',
    name: 'Raycast',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf4f2_raycast.svg',
    description: 'Connect Raycast & Mac',
    href: 'https://reclaim.ai/integrations/raycast',
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf80a_hubspot_logo.svg',
    description: 'HubSpot coming soon',
    href: '#',
    comingSoon: true,
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce',
    logo: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf68a_new_salesforce.svg',
    description: 'Salesforce coming soon',
    href: '#',
    comingSoon: true,
  },
] as const;

export const ENTERPRISE_FEATURES_DATA = [
  {
    id: 'ent-soc2',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf834_soc2_02.svg',
    title: 'SOC 2 Type II',
    description: 'Proud to hold the highest standards for security & compliance.',
  },
  {
    id: 'ent-sso',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf836_sso_02.svg',
    title: 'SSO & SCIM',
    description: 'Authenticate with your IdP for SSO & provision users via SCIM.',
  },
  {
    id: 'ent-gdpr',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf835_gdpr_02.svg',
    title: 'GDPR & DPF',
    description: 'Your personal data is always properly handled & safe.',
  },
  {
    id: 'ent-onboard',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf832_onboarding_02.svg',
    title: 'Custom onboarding',
    description: 'Set up an in-depth onboarding & training workshop for your company or team.',
  },
  {
    id: 'ent-support',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf831_support_02.svg',
    title: 'Live human support',
    description: 'Get live chat & email support, with a <20 minute average response time.',
  },
  {
    id: 'ent-uptime',
    icon: 'https://cdn.prod.website-files.com/67859049c02d67b2cfcceebf/67859049c02d67b2cfccf833_uptime_02.svg',
    title: '99.9% uptime',
    description: 'Advanced high availability & disaster recovery you can trust.',
  },
] as const;

export const TRUSTED_COMPANIES = [
  'Google',
  'Amazon',
  'Microsoft',
  'Slack',
  'Zoom',
] as const;

export const TESTIMONIALS_DATA: {
  grafana?: {
    id: string;
    author: string;
    title: string;
    company: string;
    quote: string;
    image: string;
    companyLogo: string;
    illustration: string;
  };
} = {};

export const PLATFORM_INTEGRATIONS_DATA: Array<{
  id: string;
  name: string;
  logo: string;
  description: string;
  href: string;
}> = [];

export const TIMELINE_DATA = [
  {
    id: 'timeline-today',
    period: 'Today',
    items: [
      'Focus Time is instantly protected',
      'AI starts flexibly defending your priorities',
      'Productivity trends are discovered via analytics',
    ],
  },
  {
    id: 'timeline-day7',
    period: 'Day 7',
    items: [
      'AI optimizes 20% more long "deep work" sessions',
      'Meetings automatically adjust to an ideal time',
      'Fragmented time blocks reduce by 50%',
    ],
  },
  {
    id: 'timeline-day30',
    period: 'Day 30',
    items: [
      'Focus Time increases by 50%',
      'Meeting load reduces by 15%',
      'Work efficiency improves by 40%',
    ],
  },
] as const;
