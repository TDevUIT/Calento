import { BASE_URL } from '@/config/metadata.config';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'SoftwareApplication' | 'Product';
  data?: Record<string, unknown>;
}

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Calento',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  description: 'AI-powered calendar assistant for smart scheduling and time management',
  sameAs: [
    'https://twitter.com/calento',
    'https://linkedin.com/company/calento',
    'https://github.com/calento',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@calento.space',
    contactType: 'Customer Support',
  },
};

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Calento',
  url: BASE_URL,
  description: 'AI Calendar Assistant for smart scheduling and productivity',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const softwareApplicationData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Calento',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '10000',
  },
  description: 'AI-powered calendar assistant that helps you schedule meetings, manage time, and boost productivity.',
  screenshot: `${BASE_URL}/screenshot-1.png`,
  featureList: [
    'AI Scheduling',
    'Calendar Sync',
    'Smart Analytics',
    'Team Collaboration',
    'Google Calendar Integration',
    'Outlook Integration',
  ],
};

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  let structuredData;

  switch (type) {
    case 'Organization':
      structuredData = { ...organizationData, ...data };
      break;
    case 'WebSite':
      structuredData = { ...websiteData, ...data };
      break;
    case 'SoftwareApplication':
      structuredData = { ...softwareApplicationData, ...data };
      break;
    case 'Product':
      structuredData = data;
      break;
    default:
      structuredData = data;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const BreadcrumbStructuredData = ({ items }: { items: Array<{ name: string; url: string }> }) => {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
};

export const FAQStructuredData = ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => {
  const faqData = {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
};

export const BlogPostStructuredData = ({
  post,
}: {
  post: {
    title: string;
    excerpt?: string;
    content?: string;
    featured_image?: string;
    author_name?: string;
    author_avatar?: string;
    published_at?: string;
    updated_at?: string;
    slug: string;
    category_name?: string;
    tags?: Array<{ name: string }>;
  };
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://calento.space';
  const url = `${baseUrl}/blog/${post.slug}`;

  const blogPostData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featured_image ? [post.featured_image] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: post.author_name
      ? {
          '@type': 'Person',
          name: post.author_name,
          image: post.author_avatar,
          url: `${baseUrl}/blog/author/${post.author_name.toLowerCase().replace(/\s+/g, '-')}`,
        }
      : {
          '@type': 'Organization',
          name: 'Calento',
          url: baseUrl,
          logo: `${baseUrl}/logo.svg`,
        },
    publisher: {
      '@type': 'Organization',
      name: 'Calento',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags?.map((tag) => tag.name).join(', '),
    articleSection: post.category_name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostData) }}
    />
  );
};

export const BlogStructuredData = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://calento.space';

  const blogData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Calento Blog',
    description: 'Insights, tips, and stories about productivity, time management, and AI-powered scheduling.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Calento',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogData) }}
    />
  );
};
