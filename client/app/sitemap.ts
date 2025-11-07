import { MetadataRoute } from 'next';

interface BlogPost {
  slug: string;
  updated_at?: string;
  published_at?: string;
  created_at: string;
  is_featured?: boolean;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Skip fetch during build if API is not available
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      // During build without API URL, return empty array
      return [];
    }

    const response = await fetch(`${baseUrl}/api/blog-posts/published?limit=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'no-store', // Don't cache during build
    });
    
    if (!response.ok) {
      // Silently fail and return empty array
      return [];
    }
    
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    // Silently fail during build - API may not be running
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Blog posts unavailable during build:', error instanceof Error ? error.message : 'Unknown error');
    }
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://calento.space';
  const currentDate = new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features/ai-scheduling`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/calendar-sync`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/time-management`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/integrations`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Fetch blog posts and add to sitemap
  const blogPosts = await getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: BlogPost) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at || post.created_at,
    changeFrequency: 'weekly' as const,
    priority: post.is_featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...blogPages];
}
