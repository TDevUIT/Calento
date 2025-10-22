import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Get in Touch',
  description: 'Have questions? Contact our team for support, sales inquiries, or partnership opportunities. We\'re here to help.',
  path: '/contact',
  keywords: ['contact calento', 'customer support', 'sales contact', 'help'],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
