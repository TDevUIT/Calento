"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePublicBookingLink, useAvailableSlots } from "@/hook/booking";
import { useAuthStore } from "@/store/auth.store";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import {
  LoadingState,
  ErrorState,
  ConfirmationStep,
  BookingHeader,
  TimeSelectionStep,
  BookingDetailsStep,
  useBookingForm,
  formatDuration,
  formatTimeSlot,
  formatDateDisplay,
} from "@/components/booking";

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: bookingLink, isLoading: isLoadingLink, error: linkError } = usePublicBookingLink(slug);
  const currentUser = useAuthStore((s) => s.user);

  const {
    selectedDate,
    selectedSlot,
    step,
    bookingData,
    setBookingData,
    createBookingMutation,
    handleDateSelect,
    handleSlotSelect,
    handleContinueToDetails,
    handleBookingSubmit,
    setStep,
  } = useBookingForm(slug);

  const { data: availableSlots, isLoading: isLoadingSlotsData } = useAvailableSlots(slug, {
    start_date: selectedDate,
    end_date: selectedDate,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const isOwner = currentUser?.id === bookingLink?.user_id;

  if (isLoadingLink) return <LoadingState />;

  if (linkError || !bookingLink) {
    return (
      <ErrorState
        title="Booking Link Not Found"
        message="The booking link you're looking for doesn't exist or has been deactivated."
        variant="error"
      />
    );
  }

  if (!bookingLink.is_active) {
    return (
      <ErrorState
        title="Booking Temporarily Unavailable"
        message="This booking link is currently inactive. Please try again later or contact the organizer."
        variant="warning"
      />
    );
  }

  if (step === 'confirmation') {
    return (
      <ConfirmationStep
        bookingLink={bookingLink}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        bookerData={bookingData}
        formatDateDisplay={formatDateDisplay}
        formatTimeSlot={formatTimeSlot}
        formatDuration={formatDuration}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-gray-900 py-10">
      <div className={`mx-auto px-4 ${currentUser ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <BookingHeader
          currentUser={currentUser ? {
            id: currentUser.id,
            avatar: currentUser.avatar || undefined,
            username: currentUser.username,
            email: currentUser.email,
          } : null}
          bookingUser={bookingLink.user}
          bookingTitle={bookingLink.title}
          isOwner={isOwner}
          onEditClick={() => setEditDialogOpen(true)}
        />

        {step === 'select-time' && (
          <TimeSelectionStep
            bookingLink={bookingLink}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            availableSlots={availableSlots}
            isLoadingSlots={isLoadingSlotsData}
            currentUser={currentUser ? {
              id: currentUser.id,
              avatar: currentUser.avatar || undefined,
              username: currentUser.username,
              email: currentUser.email,
            } : null}
            onDateSelect={handleDateSelect}
            onSlotSelect={handleSlotSelect}
            onContinue={handleContinueToDetails}
            formatDuration={formatDuration}
            formatTimeSlot={formatTimeSlot}
          />
        )}

        {step === 'enter-details' && (
          <BookingDetailsStep
            bookingLink={bookingLink}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            bookingData={bookingData}
            setBookingData={setBookingData}
            isPending={createBookingMutation.isPending}
            onBack={() => setStep('select-time')}
            onSubmit={handleBookingSubmit}
            formatDateDisplay={formatDateDisplay}
            formatTimeSlot={formatTimeSlot}
            formatDuration={formatDuration}
          />
        )}
      </div>

      {isOwner && (
        <CreateBookingLinkDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          bookingLink={bookingLink}
        />
      )}
    </div>
  );
}
