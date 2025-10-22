import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Smart Analytics - Time Management Insights',
  description: 'Track time patterns, analyze productivity, and optimize your schedule with AI-powered analytics. Get insights to improve your time management.',
  path: '/features/time-management',
  keywords: [
    'time management',
    'productivity analytics',
    'time tracking',
    'calendar analytics',
    'schedule optimization',
    'productivity insights',
  ],
});

export default function TimeManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
