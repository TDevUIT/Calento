import { Metadata } from 'next';

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://calento.space';

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Calento - AI Calendar Assistant | Smart Scheduling & Time Management',
    template: '%s | Calento'
  },
  description: 'Get your time back with AI. The #1 AI calendar app for individuals, teams, and organizations. Smart scheduling, calendar sync, and productivity analytics.',
  keywords: [
    'AI calendar',
    'calendar assistant',
    'smart scheduling',
    'meeting scheduler',
    'time management',
    'productivity app',
    'calendar sync',
    'Google Calendar integration',
    'Outlook calendar',
    'team scheduling',
    'automated scheduling',
    'calendar AI',
    'scheduling assistant',
    'calendar management'
  ],
  authors: [{ name: 'Calento Team' }],
  creator: 'Calento',
  publisher: 'Calento',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Calento',
    title: 'Calento - AI Calendar Assistant',
    description: 'Get your time back with AI. The #1 AI calendar app for smart scheduling and productivity.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calento - AI Calendar Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calento - AI Calendar Assistant',
    description: 'Get your time back with AI. The #1 AI calendar app for smart scheduling.',
    images: ['/twitter-image.png'],
    creator: '@calento',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'productivity',
};

export const generatePageMetadata = (params: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
}): Metadata => {
  const { title, description, path = '', keywords = [], image, noindex = false } = params;
  const url = `${BASE_URL}${path}`;

  return {
    title,
    description,
    keywords: [...(DEFAULT_METADATA.keywords as string[]), ...keywords],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Calento',
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : DEFAULT_METADATA.openGraph?.images,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : ['/twitter-image.png'],
    },
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : DEFAULT_METADATA.robots,
  };
};
