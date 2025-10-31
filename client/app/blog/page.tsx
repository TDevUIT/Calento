'use client';

import { useState } from 'react';
import { BookOpen, Search, TrendingUp, Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublishedPosts, useFeaturedPosts, usePopularPosts } from '@/hook/blog';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Link from 'next/link';
import Image from 'next/image';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 9;

  const { data: publishedData, isLoading: postsLoading, error: postsError } = usePublishedPosts(currentPage, pageLimit);
  const { data: featuredData } = useFeaturedPosts(3);
  const { data: popularData } = usePopularPosts(5);

  const posts = Array.isArray(publishedData?.data) ? publishedData.data : [];
  const featuredPosts = Array.isArray(featuredData?.data) ? featuredData.data : [];
  const popularPosts = Array.isArray(popularData?.data) ? popularData.data : [];
  const meta = publishedData?.meta;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadingTime = (minutes?: number) => {
    if (!minutes) return '5 min read';
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Minimal Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Blog
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Insights & Stories
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Exploring productivity, time management, and the art of getting things done.
            </p>
          </div>
          
          {/* Minimal Search */}
          <div className="max-w-2xl mt-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base bg-gray-50 border-gray-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Featured Posts - Clean Design */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <div className="flex items-baseline gap-3 mb-8">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Featured
                  </h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="space-y-8">
                  {featuredPosts.map((post) => (
                    <Link 
                      key={post.id} 
                      href={PUBLIC_ROUTES.BLOG_POST(post.slug)}
                      className="block group"
                    >
                      <article className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-900 transition-colors">
                        <div className="grid md:grid-cols-5 gap-0">
                          {post.featured_image && (
                            <div className="relative h-64 md:h-full md:col-span-2">
                              <Image
                                src={post.featured_image}
                                alt={post.alt_text || post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-8 md:col-span-3 flex flex-col justify-center">
                            {post.category_name && (
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
                                {post.category_name}
                              </span>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <time>{formatDate(post.published_at)}</time>
                              <span className="flex items-center gap-1">
                                {formatReadingTime(post.reading_time)}
                              </span>
                              <span className="flex items-center gap-1">
                                {post.views_count} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Posts */}
            <div>
              <div className="flex items-baseline gap-3 mb-8">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Latest Articles
                </h2>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              {postsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blog Posts Yet</h3>
                    <p className="text-gray-600 mb-4">
                      The blog is currently empty. Check back soon for insights and articles!
                    </p>
                    {postsError && (
                      <p className="text-sm text-red-600">
                        Error loading posts. Please try again later.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-8 mb-12">
                    {posts.map((post) => (
                      <Link 
                        key={post.id} 
                        href={PUBLIC_ROUTES.BLOG_POST(post.slug)}
                        className="block group"
                      >
                        <article className="border-b border-gray-200 pb-8 hover:border-gray-900 transition-colors">
                          <div className="flex gap-6">
                            {post.featured_image && (
                              <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={post.featured_image}
                                  alt={post.alt_text || post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {post.category_name && (
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                                  {post.category_name}
                                </span>
                              )}
                              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-gray-600 transition-colors">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  {post.author_avatar && (
                                    <Image
                                      src={post.author_avatar}
                                      alt={post.author_name}
                                      width={20}
                                      height={20}
                                      className="rounded-full"
                                    />
                                  )}
                                  <span>{post.author_name}</span>
                                </div>
                                <span>•</span>
                                <time>{formatDate(post.published_at)}</time>
                                <span>•</span>
                                <span>{formatReadingTime(post.reading_time)}</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {meta && meta.totalPages > 1 && (
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="text-gray-900 hover:text-gray-600"
                      >
                        ← Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {meta.page} of {meta.totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                        disabled={currentPage === meta.totalPages}
                        className="text-gray-900 hover:text-gray-600"
                      >
                        Next →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-12">
              {/* Popular Posts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
                  Popular
                </h3>
                {popularPosts.length === 0 ? (
                  <p className="text-sm text-gray-500">No popular posts yet.</p>
                ) : (
                  <div className="space-y-6">
                    {popularPosts.map((post, index) => (
                      <Link 
                        key={post.id}
                        href={PUBLIC_ROUTES.BLOG_POST(post.slug)}
                        className="block group"
                      >
                        <article className="flex gap-4">
                          <span className="text-3xl font-bold text-gray-200 group-hover:text-gray-400 transition-colors leading-none pt-1">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-gray-600 line-clamp-2 mb-2 transition-colors">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{post.views_count} views</span>
                              <span>•</span>
                              <time>{formatDate(post.published_at)}</time>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Get the latest articles delivered to your inbox.
                </p>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
