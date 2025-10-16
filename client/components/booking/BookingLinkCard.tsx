"use client";

import { useState } from "react";
import { Clock, Users, Edit, Trash2, Copy, MoreVertical, Eye, EyeOff, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/radix-dropdown-menu";
import { BookingLink } from "@/interface/booking.interface";
import { formatDuration, getBookingLinkColorClasses, generateBookingLinkUrl } from "@/utils/booking.utils";
import { useToggleBookingLink, useDeleteBookingLink } from "@/hook/booking";
import { toast } from "sonner";

interface BookingLinkCardProps {
  bookingLink: BookingLink;
  onEdit?: (bookingLink: BookingLink) => void;
  onViewBookings?: (bookingLink: BookingLink) => void;
}

export function BookingLinkCard({ 
  bookingLink, 
  onEdit, 
  onViewBookings 
}: BookingLinkCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const toggleMutation = useToggleBookingLink();
  const deleteMutation = useDeleteBookingLink();

  const handleCopyLink = () => {
    const fullUrl = generateBookingLinkUrl(bookingLink.slug);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(bookingLink.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Link copied to clipboard!");
  };

  const handleToggle = () => {
    toggleMutation.mutate(bookingLink.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${bookingLink.title}"?`)) {
      deleteMutation.mutate(bookingLink.id);
    }
  };


  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{bookingLink.title}</CardTitle>
              <Badge 
                variant={bookingLink.is_active ? "default" : "secondary"}
                className={bookingLink.is_active 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }
              >
                {bookingLink.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {bookingLink.description && (
              <CardDescription className="mt-2">
                {bookingLink.description}
              </CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(bookingLink)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewBookings?.(bookingLink)}>
                <Users className="mr-2 h-4 w-4" />
                View Bookings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggle}>
                {bookingLink.is_active ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatDuration(bookingLink.duration_minutes)}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {bookingLink.bookings_count || 0} bookings
            </div>
          </div>

          {/* URL and Copy Button */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <code className="text-sm bg-muted px-3 py-2 rounded block truncate">
                {generateBookingLinkUrl(bookingLink.slug).replace(/^https?:\/\//, '')}
              </code>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyLink}
              disabled={copiedId === bookingLink.id}
            >
              <Copy className="mr-2 h-4 w-4" />
              {copiedId === bookingLink.id ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Additional Info */}
          {bookingLink.advance_notice_hours > 0 && (
            <div className="text-xs text-muted-foreground">
              Requires {bookingLink.advance_notice_hours}h advance notice
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
