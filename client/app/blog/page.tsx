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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Tempra Blog</h1>
            <p className="text-xl text-blue-100 mb-8">
              Insights, tips, and stories about productivity and time management
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg bg-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Featured Posts
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-2 gap-6">
                        {post.featured_image && (
                          <div className="relative h-64 md:h-full">
                            <Image
                              src={post.featured_image}
                              alt={post.alt_text || post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col justify-center">
                          {post.category_name && (
                            <Badge 
                              className="w-fit mb-3"
                              style={{ backgroundColor: post.category_color || '#6366f1' }}
                            >
                              {post.category_name}
                            </Badge>
                          )}
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600">
                            <Link href={PUBLIC_ROUTES.BLOG_POST(post.slug)}>
                              {post.title}
                            </Link>
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.published_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatReadingTime(post.reading_time)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views_count}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {posts.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        {post.featured_image && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={post.featured_image}
                              alt={post.alt_text || post.title}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                        )}
                        <CardHeader>
                          {post.category_name && (
                            <Badge 
                              className="w-fit mb-2"
                              style={{ backgroundColor: post.category_color || '#6366f1' }}
                            >
                              {post.category_name}
                            </Badge>
                          )}
                          <CardTitle className="hover:text-blue-600">
                            <Link href={PUBLIC_ROUTES.BLOG_POST(post.slug)}>
                              {post.title}
                            </Link>
                          </CardTitle>
                          {post.excerpt && (
                            <CardDescription className="line-clamp-2 mt-2">
                              {post.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            {post.author_avatar && (
                              <Image
                                src={post.author_avatar}
                                alt={post.author_name}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatReadingTime(post.reading_time)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views_count}
                              </div>
                            </div>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {meta && meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {meta.page} of {meta.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                        disabled={currentPage === meta.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Popular Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {popularPosts.length === 0 ? (
                    <p className="text-sm text-gray-500">No popular posts yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {popularPosts.map((post, index) => (
                        <li key={post.id} className="flex gap-3 group">
                          <span className="text-2xl font-bold text-gray-300 group-hover:text-blue-600">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <Link 
                              href={PUBLIC_ROUTES.BLOG_POST(post.slug)}
                              className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 text-sm"
                            >
                              {post.title}
                            </Link>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.published_at)}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Subscribe to get the latest articles delivered to your inbox.
                  </p>
                  <Button className="w-full">
                    Subscribe Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
