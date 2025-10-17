"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import { useBookingLinks } from "@/hook/booking";
import { BookingLink } from "@/service/booking.service";
import {
  SchedulingLinksHeader,
  SchedulingLinkCard,
  BusinessBanner,
  UserBookingInfo,
  ActionsBar,
  GmailIntegration,
} from "@/components/scheduling-links";

const SchedulingLinksPage = () => {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingBookingLink, setEditingBookingLink] = useState<BookingLink | null>(null);
  const [activeTab, setActiveTab] = useState("my-links");
  const [showBanner, setShowBanner] = useState(true);

  const { data: bookingLinks } = useBookingLinks();

  const handleEdit = (bookingLink: BookingLink) => {
    setEditingBookingLink(bookingLink);
    setCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingBookingLink(null);
  };

  const handleCardClick = () => {
    router.push('/dashboard/scheduling-links/high-priority-meeting');
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleBannerClose = () => {
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SchedulingLinksHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreateClick={handleCreateClick}
        linkCount={bookingLinks?.length || 3}
      />
      
      <div className="bg-gradient-to-r from-blue-50 to-transparent h-1" />

      <div className="px-6 py-6">
        {showBanner && <BusinessBanner onClose={handleBannerClose} />}
        
        <UserBookingInfo
          name="Thái Tạ's Booking Page"
          url="app.reclaim.ai/m/tt-t"
        />
        
        <ActionsBar />
        
        <div className="max-w-md">
          <SchedulingLinkCard
            title="High Priority Meeting"
            description="This is a link to my maximum availability."
            duration="1 hr"
            onClick={handleCardClick}
          />
        </div>
        
        <GmailIntegration />
      </div>

      <CreateBookingLinkDialog
        open={createDialogOpen}
        onOpenChange={handleCloseDialog}
        bookingLink={editingBookingLink}
      />
    </div>
  );
};

export default SchedulingLinksPage;
