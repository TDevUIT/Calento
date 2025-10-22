import { Metadata } from 'next';
import { BASE_URL } from '@/config/metadata.config';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/blog-posts/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || post.title;
  const keywords = post.seo_keywords?.split(',').map((k: string) => k.trim()) || [];
  const image = post.featured_image || '/og-image.png';
  const url = `${BASE_URL}/blog/${params.slug}`;
  const publishedTime = post.published_at || post.created_at;
  const modifiedTime = post.updated_at || publishedTime;

  return {
    title,
    description,
    keywords: [
      ...keywords,
      'productivity',
      'time management',
      'calendar',
      'scheduling',
    ],
    authors: post.author_name ? [{ name: post.author_name }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Calento',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.alt_text || title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags?.map((tag: any) => tag.name) || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
