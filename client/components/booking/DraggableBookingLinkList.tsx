"use client";

import { useState } from "react";
import { DraggableBookingLinkCard } from "./DraggableBookingLinkCard";
import { BookingLink } from "@/service/booking.service";
import { toast } from "sonner";

interface DraggableBookingLinkListProps {
  bookingLinks: BookingLink[];
  onEdit?: (bookingLink: BookingLink) => void;
  onViewBookings?: (bookingLink: BookingLink) => void;
  onReorder?: (reorderedLinks: BookingLink[]) => void;
}

export function DraggableBookingLinkList({
  bookingLinks,
  onEdit,
  onViewBookings,
  onReorder,
}: DraggableBookingLinkListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localBookingLinks, setLocalBookingLinks] = useState(bookingLinks);

  useState(() => {
    setLocalBookingLinks(bookingLinks);
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBookingLinks = [...localBookingLinks];
    const [movedItem] = newBookingLinks.splice(fromIndex, 1);
    newBookingLinks.splice(toIndex, 0, movedItem);

    setLocalBookingLinks(newBookingLinks);
    setDraggedIndex(null);
    setDragOverIndex(null);

    onReorder?.(newBookingLinks);
    
    toast.success("Booking links reordered successfully");
  };

  return (
    <div className="space-y-4">
      {localBookingLinks.map((bookingLink, index) => (
        <DraggableBookingLinkCard
          key={bookingLink.id}
          bookingLink={bookingLink}
          index={index}
          onEdit={onEdit}
          onViewBookings={onViewBookings}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
          dragOverIndex={dragOverIndex ?? undefined}
        />
      ))}
      
      {/* Drop zone at the end */}
      {draggedIndex !== null && (
        <div
          className="h-2 rounded border-2 border-dashed border-primary/50 bg-primary/5 transition-all duration-200"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIndex(localBookingLinks.length);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
            handleDrop(fromIndex, localBookingLinks.length - 1);
          }}
        />
      )}
    </div>
  );
}
