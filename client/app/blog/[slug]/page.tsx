'use client';

import { use } from 'react';
import { Calendar, Clock, Eye, User, ArrowLeft, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlogPostBySlug, useRelatedPosts } from '@/hook/blog';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Link from 'next/link';
import Image from 'next/image';

const BlogPostPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  
  const { data: postData, isLoading, error } = useBlogPostBySlug(slug);
  const post = postData?.data;
  
  const { data: relatedData } = useRelatedPosts(post?.id || '', 3, !!post?.id);
  const relatedPosts = relatedData?.data || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes?: number) => {
    if (!minutes) return '5 min read';
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link href={PUBLIC_ROUTES.BLOG}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={PUBLIC_ROUTES.BLOG}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {post.category && (
            <Badge 
              className="mb-4"
              style={{ backgroundColor: post.category.color || '#6366f1' }}
            >
              {post.category.name}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-6 text-gray-600 mb-8">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <User className="h-4 w-4" />
                    {post.author.name}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published_at)}
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {formatReadingTime(post.reading_time)}
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Eye className="h-4 w-4" />
              {post.views_count} views
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.featured_image && (
          <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.alt_text || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link 
                  key={tag.slug}
                  href={PUBLIC_ROUTES.BLOG_TAG(tag.slug)}
                >
                  <Badge variant="outline" className="hover:bg-gray-100">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {post.author && post.author.bio && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {post.author.avatar_url && (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  {relatedPost.featured_image && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    {relatedPost.category_name && (
                      <Badge className="mb-2" variant="secondary">
                        {relatedPost.category_name}
                      </Badge>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                      <Link href={PUBLIC_ROUTES.BLOG_POST(relatedPost.slug)}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatReadingTime(relatedPost.reading_time)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
