"use client";

import { useState } from "react";
import { Clock, Users, Edit, Trash2, Copy, MoreVertical, Eye, EyeOff } from "lucide-react";
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
import { formatDuration, generateBookingLinkUrl } from "@/utils/booking.utils";
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
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 truncate">{bookingLink.title}</h3>
              {!bookingLink.is_active && (
                <span className="text-xs text-gray-500">(Inactive)</span>
              )}
            </div>
            {bookingLink.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                {bookingLink.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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
      
      <CardContent className="pt-0 space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDuration(bookingLink.duration_minutes)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{bookingLink.bookings_count || 0} bookings</span>
          </div>
        </div>

        {/* URL */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 truncate font-mono bg-gray-50 px-2 py-1.5 rounded">
              {generateBookingLinkUrl(bookingLink.slug).replace(/^https?:\/\//, '')}
            </div>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
