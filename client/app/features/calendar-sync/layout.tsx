import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Calendar Sync - Unified Calendar Management',
  description: 'Sync all your calendars in one place. Connect Google Calendar, Outlook, and more. Real-time 2-way sync keeps everything up to date.',
  path: '/features/calendar-sync',
  keywords: [
    'calendar sync',
    'Google Calendar sync',
    'Outlook calendar',
    'calendar integration',
    'unified calendar',
    'multi-calendar sync',
    '2-way sync',
  ],
});

export default function CalendarSyncLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
