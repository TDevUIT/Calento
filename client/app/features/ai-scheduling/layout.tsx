import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Scheduling - Automated Meeting Coordination',
  description: 'Let AI handle your scheduling with automated meeting coordination, smart conflict resolution, and natural language processing. Schedule meetings 10x faster.',
  path: '/features/ai-scheduling',
  keywords: [
    'AI scheduling',
    'automated scheduling',
    'meeting coordination',
    'smart scheduling',
    'AI meeting assistant',
    'conflict resolution',
    'natural language scheduling',
  ],
});

export default function AISchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
