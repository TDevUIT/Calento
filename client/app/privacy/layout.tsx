import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy Policy for Calento - learn how we collect, use, and protect your data.',
  path: '/privacy',
  keywords: ['privacy policy', 'privacy', 'data protection', 'calento privacy'],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
