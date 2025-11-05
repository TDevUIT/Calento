import { BASE_URL } from '@/config/metadata.config';


export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Calento',
  alternateName: 'Calento AI Calendar Assistant',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE_URL}/images/logo.png`,
  description: 'Get your time back with AI. The #1 AI calendar app for individuals, teams, and organizations. Smart scheduling, calendar sync, and productivity analytics.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@calento.space',
    availableLanguage: ['en', 'vi'],
  },
  sameAs: [
    'https://twitter.com/calento',
    'https://linkedin.com/company/calento',
    'https://facebook.com/calento',
  ],
};


export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Calento',
  alternateName: 'Calento AI Calendar Assistant',
  url: BASE_URL,
  description: 'The #1 AI calendar app for smart scheduling and time management',
  publisher: {
    '@type': 'Organization',
    name: 'Calento',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};


export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Calento',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'AI-powered calendar assistant for smart scheduling and time management',
  featureList: [
    'AI Scheduling',
    'Calendar Sync',
    'Google Calendar Integration',
    'Outlook Integration',
    'Time Management',
    'Productivity Analytics',
    'Meeting Scheduler',
    'Team Collaboration',
  ],
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};


export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Calento',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
};
