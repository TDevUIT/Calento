"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, MoreVertical, XCircle, RotateCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/service/booking.service";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export function BookingCard({ booking, onCancel, onReschedule }: BookingCardProps) {
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const isPast = endTime < new Date();
  const canModify = booking.status === 'confirmed' && !isPast;

  return (
    <Card className={cn(
      "border border-gray-200 shadow-sm hover:border-blue-300 transition-colors bg-white",
      booking.status === 'cancelled' && "opacity-60"
    )}>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={cn("text-xs font-medium", status.color)}>
                {status.label}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <p className="font-medium text-gray-900 truncate">{booking.booker_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">{booking.booker_email}</span>
              </div>
              {booking.booker_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{booking.booker_phone}</span>
                </div>
              )}
            </div>
          </div>

          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onReschedule && (
                  <DropdownMenuItem onClick={() => onReschedule(booking)}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Đổi lịch
                  </DropdownMenuItem>
                )}
                {onCancel && (
                  <DropdownMenuItem 
                    onClick={() => onCancel(booking)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy cuộc hẹn
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {/* Time Info */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium">
            {format(startTime, "dd MMM yyyy", { locale: vi })}
          </span>
          <span className="text-gray-400">•</span>
          <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span>
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </span>
        </div>

        {/* Notes */}
        {booking.booker_notes && (
          <div className="flex items-start gap-2 pt-2 border-t">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 break-words">{booking.booker_notes}</p>
          </div>
        )}

        {/* Cancellation Info */}
        {booking.status === 'cancelled' && booking.cancellation_reason && (
          <div className="flex items-start gap-2 pt-2 border-t">
            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Cancelled reason:</p>
              <p className="text-sm text-gray-600 break-words">{booking.cancellation_reason}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
