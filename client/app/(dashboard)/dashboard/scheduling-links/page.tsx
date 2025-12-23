"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import { useBookingLinks } from "@/hook/booking";
import { useAuthStore } from "@/store/auth.store";
import { BookingLink } from "@/service";
import {
  SchedulingLinkCard,
  BusinessBanner,
  UserBookingInfo,
  ActionsBar,
} from "@/components/scheduling-links";

const SchedulingLinksPage = () => {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [editingLink, setEditingLink] = useState<BookingLink | null>(null);

  const { data: bookingLinks } = useBookingLinks();
  const currentUser = useAuthStore((s) => s.user);

  const userSlug = useMemo(() => {
    if (!currentUser) return 'user';
    const username = currentUser.username || currentUser.email?.split('@')[0] || 'user';
    return username.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }, [currentUser]);

  const displayName = useMemo(() => {
    if (!currentUser) return 'User';
    const full = (currentUser.first_name?.trim() || '') + ' ' + (currentUser.last_name?.trim() || '');
    const name = full.trim() || currentUser.full_name || currentUser.username || currentUser.email?.split('@')[0] || 'User';
    return name.trim();
  }, [currentUser]);

  const bookingPageUrl = `app.calento.com/${userSlug}`;

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingLink(null);
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/scheduling-links/${id}`);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditLink = (link: BookingLink) => {
    setEditingLink(link);
    setCreateDialogOpen(true);
  };

  const handleBannerClose = () => {
    setShowBanner(false);
  };

  return (
    <div className="min-h-full bg-transparent">
      <div className="px-6 py-6">
        {showBanner && <BusinessBanner onClose={handleBannerClose} />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <UserBookingInfo
            name={`${displayName}'s Booking Page`}
            url={bookingPageUrl}
          />
          <ActionsBar />
        </div>
        
        <div className="max-w-md space-y-4">
          {bookingLinks && bookingLinks.length > 0 && (
            <SchedulingLinkCard
              title={bookingLinks[0].title}
              description={bookingLinks[0].description || "This is a link to my maximum availability."}
              duration={`${bookingLinks[0].duration_minutes >= 60 ? `${Math.floor(bookingLinks[0].duration_minutes/60)} hr` : `${bookingLinks[0].duration_minutes} min`}`}
              onClick={() => handleCardClick(bookingLinks[0].id)}
              onEdit={() => handleEditLink(bookingLinks[0])}
              bookingUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/book/${bookingLinks[0].slug}`}
            />
          )}
          
          {/* New Links Button */}
          <button
            onClick={handleCreateClick}
            className="w-full p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Links
          </button>
        </div>
      </div>

      <CreateBookingLinkDialog
        open={createDialogOpen}
        onOpenChange={handleCloseDialog}
        bookingLink={editingLink}
      />
    </div>
  );
};

export default SchedulingLinksPage;
