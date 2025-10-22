import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog - Productivity Tips & Time Management',
  description: 'Discover insights, tips, and best practices for productivity, time management, and calendar optimization. Learn how to make the most of your time with AI.',
  path: '/blog',
  keywords: [
    'productivity blog',
    'time management tips',
    'calendar optimization',
    'scheduling best practices',
    'AI productivity',
    'work efficiency',
    'time blocking',
    'productivity hacks',
  ],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
