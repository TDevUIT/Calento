import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Us - Our Mission & Story',
  description: 'Learn about Calento and our mission to help individuals and teams reclaim their time with AI-powered calendar management.',
  path: '/about',
  keywords: ['about calento', 'company mission', 'AI calendar company', 'team'],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
