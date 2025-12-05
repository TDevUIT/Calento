import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface GenerateSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateSEO({
  title,
  description,
  path = '',
  image = '/og-image.png',
  noIndex = false,
  keywords = [],
}: GenerateSEOProps): Metadata {
  const url = `${baseUrl}${path}`;
  const fullTitle = title.includes('Calento') ? title : `${title} | Calento`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Calento',
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: '@calento',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
  };
}


interface BlogSEOProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  slug: string;
  image?: string;
  tags?: string[];
}

export function generateBlogSEO({
  title,
  description,
  author,
  publishedAt,
  modifiedAt,
  slug,
  image = '/og-image.png',
  tags = [],
}: BlogSEOProps): Metadata {
  const url = `${baseUrl}/blog/${slug}`;

  return {
    title: `${title} | Calento Blog`,
    description,
    keywords: tags,
    alternates: {
      canonical: url,
    },
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      url,
      siteName: 'Calento',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt || publishedAt,
      authors: [author],
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
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
  };
}

export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function formatKeywords(keywords: string[]): string[] {
  return keywords
    .map((k) => k.toLowerCase().trim())
    .filter((k, index, self) => k && self.indexOf(k) === index);
}


export function generateOGImageUrl(title: string, description?: string): string {
  const params = new URLSearchParams({
    title,
    ...(description && { description }),
  });
  return `${baseUrl}/api/og?${params.toString()}`;
}
