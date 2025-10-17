"use client";

import { useRouter, useParams } from "next/navigation";
import { useBookingLinks } from "@/hook/booking";
import {
  DetailsHeader,
  DetailsContent,
  UpcomingSidebar,
} from "@/components/scheduling-links";

const SchedulingLinkDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { data: bookingLinks } = useBookingLinks();
  
  const linkDetails = {
    id: params.id,
    title: "High Priority Meeting",
    description: "This is a link to my maximum availability.",
    group: "Thái Tạ's Booking Page",
    duration: "1 hr",
    hours: "Meeting Hours",
    calendar: "thonv228@gmail.com",
    dates: "4 hours into the future - 60 days into the future",
    location: "Google Meet",
    organizers: "Thái Tạ",
    schedulingLink: "https://app.reclaim.ai/m/thai-high-priority-mee...",
  };

  const upcomingMeeting = {
    name: "Tại vườn Thái",
    date: "Oct 20 10:00am - 11:00am"
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DetailsHeader onBack={handleBack} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DetailsContent details={linkDetails} />
          </div>
          
          <div className="lg:col-span-1">
            <UpcomingSidebar meeting={upcomingMeeting} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingLinkDetailsPage;
