import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of Service for Calento - rules and conditions for using our platform.',
  path: '/terms',
  keywords: ['terms of service', 'terms', 'legal', 'calento terms'],
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
