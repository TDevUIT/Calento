"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import { useBookingLinks } from "@/hook/booking";
import {
  SchedulingLinksHeader,
  SchedulingLinkCard,
  BusinessBanner,
  UserBookingInfo,
  ActionsBar,
} from "@/components/scheduling-links";

const SchedulingLinksPage = () => {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { data: bookingLinks } = useBookingLinks();

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/scheduling-links/${id}`);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  

  const handleBannerClose = () => {
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SchedulingLinksHeader
        onCreateClick={handleCreateClick}
      />
      
      <div className="px-6 py-6">
        {showBanner && <BusinessBanner onClose={handleBannerClose} />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <UserBookingInfo
            name="Thái Tạ's Booking Page"
            url="app.reclaim.ai/m/tt-t"
          />
          <ActionsBar />
        </div>
        
        <div className="max-w-md">
          {bookingLinks && bookingLinks.length > 0 && (
            <SchedulingLinkCard
              title={bookingLinks[0].title}
              description={bookingLinks[0].description || ""}
              duration={`${bookingLinks[0].duration_minutes >= 60 ? `${Math.floor(bookingLinks[0].duration_minutes/60)} hr` : `${bookingLinks[0].duration_minutes} min`}`}
              onClick={() => handleCardClick(bookingLinks[0].id)}
            />
          )}
        </div>
      </div>

      <CreateBookingLinkDialog
        open={createDialogOpen}
        onOpenChange={handleCloseDialog}
        bookingLink={undefined}
      />
    </div>
  );
};

export default SchedulingLinksPage;
