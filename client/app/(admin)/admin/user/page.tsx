'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api, getErrorMessage } from '@/service';

type AdminUser = {
  id?: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  is_active?: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  hasPrevPage?: boolean;
};

type UsersListResponse = {
  status: number;
  message: string;
  data: {
    items: AdminUser[];
    meta: PaginationMeta;
  };
  timestamp: string;
};

const UserAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', currentPage, pageLimit],
    queryFn: async (): Promise<UsersListResponse> => {
      try {
        const res = await api.get<UsersListResponse>('/users', {
          params: { page: currentPage, limit: pageLimit },
          withCredentials: true,
        });
        return res.data;
      } catch (e) {
        throw new Error(getErrorMessage(e));
      }
    },
    staleTime: 30 * 1000,
  });

  const users = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasPrev = !!(meta?.hasPreviousPage ?? meta?.hasPrevPage);
  const hasNext = !!meta?.hasNextPage;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">List of users in the system.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Username</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Verified</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
                  <p className="mt-4 text-muted-foreground">Loading users...</p>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-sm font-medium">Failed to load users</p>
                  <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No users found.</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id ?? `${user.email}-${user.username}`}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_verified ? 'default' : 'outline'}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'outline'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(user.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} users)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!hasPrev || currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))}
              disabled={!hasNext || currentPage === meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;