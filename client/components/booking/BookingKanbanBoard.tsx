"use client";

import { useMemo } from "react";
import { Clock, CheckCircle2, XCircle, CheckCheck } from "lucide-react";
import { Booking } from "@/service";
import { BookingCard } from "./BookingCard";

interface BookingKanbanBoardProps {
  bookings: Booking[];
  onCancelBooking?: (booking: Booking) => void;
  onRescheduleBooking?: (booking: Booking) => void;
}

const columns = [
  {
    status: "pending" as const,
    title: "Pending",
    icon: Clock,
  },
  {
    status: "confirmed" as const,
    title: "Confirmed",
    icon: CheckCircle2,
  },
  {
    status: "completed" as const,
    title: "Completed",
    icon: CheckCheck,
  },
  {
    status: "cancelled" as const,
    title: "Cancelled",
    icon: XCircle,
  },
];

export function BookingKanbanBoard({
  bookings,
  onCancelBooking,
  onRescheduleBooking,
}: BookingKanbanBoardProps) {
  const groupedBookings = useMemo(() => {
    const groups: Record<string, Booking[]> = {
      pending: [],
      confirmed: [],
      completed: [],
      cancelled: [],
    };

    bookings.forEach((booking) => {
      if (groups[booking.status]) {
        groups[booking.status].push(booking);
      }
    });

    return groups;
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const Icon = column.icon;
        const columnBookings = groupedBookings[column.status] || [];

        return (
          <div key={column.status} className="flex flex-col">
            {/* Column Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border border-gray-200">
                <Icon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-700">
                  {column.title}
                </h3>
                <span className="ml-auto text-xs text-gray-500">
                  {columnBookings.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-3 min-h-[300px]">
              {columnBookings.length > 0 ? (
                columnBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={onCancelBooking}
                    onReschedule={onRescheduleBooking}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center h-24 border border-dashed border-gray-200 rounded">
                  <p className="text-xs text-gray-400">No bookings</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
