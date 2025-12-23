"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useBookingLink } from "@/hook/booking";
import { useBookings, usePublicBookingLink } from "@/hook/booking";
import { useAuthStore } from "@/store/auth.store";
import { CreateBookingLinkDialog } from "@/components/booking/CreateBookingLinkDialog";
import {
  DetailsHeader,
  DetailsContent,
  UpcomingSidebar,
} from "@/components/scheduling-links";

const SchedulingLinkDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const rawParam = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : '';

  const isUuid = (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);
  const isParamUuid = isUuid(rawParam);

  const [resolvedId, setResolvedId] = useState<string>(isParamUuid ? rawParam : "");
  const slug = !isParamUuid ? rawParam : "";

  const { data: publicLink, isLoading: isLoadingSlug, isError: isErrorSlug } = usePublicBookingLink(slug);

  useEffect(() => {
    if (!isParamUuid && publicLink?.id) {
      setResolvedId(publicLink.id);
      router.replace(`/dashboard/scheduling-links/${publicLink.id}`);
    }
  }, [isParamUuid, publicLink?.id, router]);

  const { data: link, isLoading: isLoadingLink, isError: isErrorLink } = useBookingLink(resolvedId);
  const { data: bookingsData } = useBookings({ booking_link_id: resolvedId, page: 1, limit: 1 });
  const currentUser = useAuthStore((s) => s.user);
  
  const durationText = link ? (link.duration_minutes >= 60 ? `${Math.floor(link.duration_minutes / 60)} hr${link.duration_minutes >= 120 ? 's' : ''}` : `${link.duration_minutes} min`) : '';
  const datesWindowText = link ? `${link.advance_notice_hours} hours into the future - ${link.booking_window_days} days into the future` : '';
  const displayName = useMemo(() => {
    if (!currentUser) return '';
    const full = (currentUser.first_name?.trim() || '') + ' ' + (currentUser.last_name?.trim() || '');
    const name = full.trim() || currentUser.full_name || currentUser.username || currentUser.email?.split('@')[0] || '';
    return name.trim();
  }, [currentUser]);

  const schedulingUrl = link ? `${typeof window !== 'undefined' ? window.location.origin : ''}/book/${link.slug}` : '';
  const details = link ? {
    title: link.title,
    description: link.description || "This is a link to my maximum availability",
    group: displayName ? `${displayName}'s Booking Page` : "",
    duration: durationText,
    hours: link.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    calendar: currentUser?.email || "",
    dates: datesWindowText,
    location: "Google Meet",
    organizers: displayName || "",
    schedulingLink: schedulingUrl,
    active: link.is_active,
    bufferTime: link.buffer_time_minutes ? (link.buffer_time_minutes >= 60 ? `${Math.floor(link.buffer_time_minutes/60)} hr${link.buffer_time_minutes >= 120 ? 's' : ''}` : `${link.buffer_time_minutes} min`) : undefined,
    maxBookingsPerDay: link.max_bookings_per_day,
    advanceNoticeHours: link.advance_notice_hours,
    bookingWindowDays: link.booking_window_days,
    timezone: link.timezone,
    color: link.color,
  } : undefined;

  const firstUpcoming = bookingsData?.data?.[0];
  const formattedUpcoming = useMemo(() => {
    if (!firstUpcoming) return undefined;
    const fmt = new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: firstUpcoming.timezone || link?.timezone || 'UTC'
    });
    const start = fmt.format(new Date(firstUpcoming.start_time));
    const endFmt = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: firstUpcoming.timezone || link?.timezone || 'UTC'
    });
    const end = endFmt.format(new Date(firstUpcoming.end_time));
    return `${start} - ${end}`;
  }, [firstUpcoming, link?.timezone]);

  const upcomingMeeting = firstUpcoming ? {
    name: firstUpcoming.booker_name,
    email: firstUpcoming.booker_email,
    status: firstUpcoming.status,
    phone: firstUpcoming.booker_phone,
    notes: firstUpcoming.booker_notes,
    date: formattedUpcoming || `${new Date(firstUpcoming.start_time).toLocaleString()} - ${new Date(firstUpcoming.end_time).toLocaleTimeString()}`,
  } : undefined;

  const handleBack = () => {
    router.back();
  };

  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-full bg-transparent">
      <div className="bg-white pb-8">
        <DetailsHeader onBack={handleBack} />
        <div className="max-w-2xl mx-auto px-6">
          {(isLoadingLink || (!isParamUuid && isLoadingSlug)) && (
            <div className="animate-pulse">
              <div className="h-7 w-2/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-40 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}
          {!isParamUuid && isErrorSlug && (
            <div className="text-sm text-red-600">
              Booking link with slug &quot;{rawParam}&quot; not found.
              <button
                className="ml-3 text-blue-600 hover:underline"
                onClick={() => router.back()}
              >
                Go back
              </button>
            </div>
          )}
          {isErrorLink && isParamUuid && (
            <div className="text-sm text-red-600">Failed to load booking link.</div>
          )}
          {details && (
            <DetailsContent details={details} onEdit={() => setEditOpen(true)} />
          )}
        </div>
      </div>
      {resolvedId && upcomingMeeting && (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <UpcomingSidebar meeting={upcomingMeeting} />
        </div>
      )}

      <CreateBookingLinkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        bookingLink={link}
      />
    </div>
  );
};

export default SchedulingLinkDetailsPage;

