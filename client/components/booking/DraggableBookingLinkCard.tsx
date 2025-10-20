"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { BookingLinkCard } from "./BookingLinkCard";
import { BookingLink } from "@/service/booking.service";

interface DraggableBookingLinkCardProps {
  bookingLink: BookingLink;
  index: number;
  onEdit?: (bookingLink: BookingLink) => void;
  onViewBookings?: (bookingLink: BookingLink) => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (fromIndex: number, toIndex: number) => void;
  isDragging?: boolean;
  dragOverIndex?: number;
}

export function DraggableBookingLinkCard({
  bookingLink,
  index,
  onEdit,
  onViewBookings,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  dragOverIndex,
}: DraggableBookingLinkCardProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedIndex(index);
    onDragStart?.(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver?.(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (fromIndex !== index) {
      onDrop?.(fromIndex, index);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const isCurrentlyDragging = draggedIndex === index || isDragging;
  const isDropTarget = dragOverIndex === index && draggedIndex !== index;

  return (
    <div
      className={`relative transition-all duration-200 ${
        isCurrentlyDragging ? "opacity-50 scale-95" : ""
      } ${isDropTarget ? "transform translate-y-1" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drop indicator */}
      {isDropTarget && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10" />
      )}
      
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="group relative cursor-move"
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-1 rounded bg-background/80 backdrop-blur-sm border shadow-sm">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Booking Link Card */}
        <div className="pl-8">
          <BookingLinkCard
            bookingLink={bookingLink}
            onEdit={onEdit}
            onViewBookings={onViewBookings}
          />
        </div>
      </div>
    </div>
  );
}
