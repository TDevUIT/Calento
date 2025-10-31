'use client';

import { useState } from 'react';
import { useBlogPosts, useDeleteBlogPost, 
  // usePublishPost, useUnpublishPost 
} from '@/hook/blog';
import { BlogPostListItem, BlogPostStatus } from '@/interface/blog.interface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  // CheckCircle2, 
  // XCircle,
  MoreHorizontal,
  Filter
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const BlogAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all');
  const pageLimit = 10;

  const { data, isLoading } = useBlogPosts({
    page: currentPage,
    limit: pageLimit,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  const deleteMutation = useDeleteBlogPost();
  // const publishMutation = usePublishPost();
  // const unpublishMutation = useUnpublishPost();

  const posts = Array.isArray(data?.data) ? data.data : [];
  const meta = data?.meta;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // const getStatusBadge = (status: BlogPostStatus) => {
  //   const styles = {
  //     published: 'bg-green-100 text-green-800 border-green-200',
  //     draft: 'bg-gray-100 text-gray-800 border-gray-200',
  //     archived: 'bg-red-100 text-red-800 border-red-200',
  //   };

  //   return (
  //     <Badge variant="outline" className={styles[status]}>
  //       {status.charAt(0).toUpperCase() + status.slice(1)}
  //     </Badge>
  //   );
  // };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // const handlePublish = async (id: string) => {
  //   await publishMutation.mutateAsync(id);
  // };

  // const handleUnpublish = async (id: string) => {
  //   await unpublishMutation.mutateAsync(id);
  // };


  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Blog Management</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
            </div>
            <Link href="/admin/blog/new">
              <Button className="bg-gray-900 hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-300"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BlogPostStatus | 'all')}
          >
            <SelectTrigger className="w-40 bg-gray-50 border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold text-gray-900">Title</TableHead>
                <TableHead className="font-semibold text-gray-900">Category</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Views</TableHead>
                <TableHead className="font-semibold text-gray-900">Published</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first post'}
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post: BlogPostListItem) => (
                  <TableRow key={post.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell>
                      {post.featured_image && (
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                          <Image
                            src={post.featured_image}
                            alt={post.alt_text || post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-1 mt-1">{post.excerpt}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.category_name && (
                        <Badge variant="outline" className="border-gray-300">
                          {post.category_name}
                        </Badge>
                      )}
                    </TableCell>
                    {/* <TableCell>{getStatusBadge(post.)}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{post.views_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {post.published_at ? formatDate(post.published_at) : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* {post.status === 'published' ? (
                            <DropdownMenuItem onClick={() => handleUnpublish(post.id)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )} */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * pageLimit) + 1} to {Math.min(currentPage * pageLimit, meta.total)} of {meta.total} posts
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-gray-300"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={currentPage === meta.totalPages}
                className="border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAdminPage;