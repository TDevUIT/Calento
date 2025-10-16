"use client";

import { useState } from "react";
import { Plus, Calendar, Users, Link2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { BookingLinkCard } from "@/components/booking/BookingLinkCard";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import { DraggableBookingLinkList } from "@/components/booking/DraggableBookingLinkList";
import { DragDropHint } from "@/components/booking/DragDropHint";
import { BookingNotificationDemo } from "@/components/booking/BookingNotificationDemo";
import { useBookingLinks, useBookingStats } from "@/hook/booking";
import { BookingLink } from "@/service/booking.service";




export default function SchedulePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingBookingLink, setEditingBookingLink] = useState<BookingLink | null>(null);

  // Fetch data
  const { data: bookingLinks, isLoading: isLoadingLinks } = useBookingLinks();
  const { data: stats, isLoading: isLoadingStats } = useBookingStats();

  const handleEdit = (bookingLink: BookingLink) => {
    setEditingBookingLink(bookingLink);
    setCreateDialogOpen(true);
  };

  const handleViewBookings = (bookingLink: BookingLink) => {
    // TODO: Navigate to bookings page with filter
    console.log('View bookings for:', bookingLink.slug);
  };

  const handleReorderBookingLinks = (reorderedLinks: BookingLink[]) => {
    // TODO: Implement API call to save new order
    console.log('Reordered booking links:', reorderedLinks.map(link => link.title));
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingBookingLink(null);
  };

  // Calculate stats from data
  const activeLinksCount = bookingLinks?.filter((link: BookingLink) => link.is_active).length || 0;
  const totalBookings = stats?.total_bookings || 0;
  const thisWeekBookings = stats?.this_week_bookings || 0;

  const statsData = [
    { label: "Active Links", value: activeLinksCount.toString(), icon: Link2 },
    { label: "Total Bookings", value: totalBookings.toString(), icon: Users },
    { label: "This Week", value: thisWeekBookings.toString(), icon: TrendingUp }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your scheduling links
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BookingNotificationDemo />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingStats ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsData.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Booking Links</h2>
          {bookingLinks && bookingLinks.length > 0 && (
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          )}
        </div>
        
        {isLoadingLinks ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookingLinks && bookingLinks.length > 0 ? (
          <div>
            <DragDropHint />
            <DraggableBookingLinkList
              bookingLinks={bookingLinks}
              onEdit={handleEdit}
              onViewBookings={handleViewBookings}
              onReorder={handleReorderBookingLinks}
            />
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Link2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No booking links yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first booking link to let others schedule time with you.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Recent bookings and activity will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <CreateBookingLinkDialog
        open={createDialogOpen}
        onOpenChange={handleCloseDialog}
        bookingLink={editingBookingLink}
      />
    </div>
  );
}
