import { Metadata } from 'next';
import { generatePageMetadata } from '@/config/metadata.config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pricing Plans - Choose Your Perfect Plan',
  description: 'Simple, transparent pricing for individuals and teams. Start free, upgrade as you grow. No hidden fees. Cancel anytime.',
  path: '/pricing',
  keywords: [
    'calendar app pricing',
    'AI calendar cost',
    'scheduling software pricing',
    'free calendar app',
    'team pricing',
  ],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
