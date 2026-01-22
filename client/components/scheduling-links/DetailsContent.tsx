"use client";

import { Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface LinkDetails {
  title: string;
  description: string;
  group: string;
  duration: string;
  hours: string;
  calendar: string;
  dates: string;
  location?: string;
  locationLink?: string;
  organizers: string;
  schedulingLink: string;
  active?: boolean;
  bufferTime?: string;
  maxBookingsPerDay?: number;
  advanceNoticeHours?: number;
  bookingWindowDays?: number;
  timezone?: string;
  color?: string;
}

interface DetailsContentProps {
  details: LinkDetails;
  onEdit?: () => void;
}

export const DetailsContent = ({ details, onEdit }: DetailsContentProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(details.schedulingLink);
  };

  const handleOpen = () => {
    window.open(details.schedulingLink, '_blank');
  };

  return (
    <div className="py-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {details.title}
          </h1>
          <p className="text-sm text-gray-600">
            {details.description}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Edit className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Group</label>
            <p className="text-sm text-blue-600 hover:underline cursor-pointer">
              {details.group}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Duration</label>
            <p className="text-sm text-gray-900">{details.duration}</p>
          </div>

          {details.hours && (
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Hours</label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">{details.hours}</p>
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Calendar</label>
            <p className="text-sm text-gray-900">{details.calendar}</p>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-700 block mb-1">Dates</label>
            <p className="text-sm text-gray-900">{details.dates}</p>
          </div>

          {details.location && (
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Location</label>
              <div className="flex items-center gap-1">
                {details.location === 'Google Meet' ? (
                  <>
                    <Image
                      className="h-4 w-auto"
                      src="/Google_Meet_icon.svg"
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                    />
                    {details.locationLink ? (
                      <Link
                        href={details.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >
                        Google Meet
                      </Link>
                    ) : (
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer">Google Meet</span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      </svg>
                    </div>
                    {details.locationLink ? (
                      <Link
                        href={details.locationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >
                        {details.location}
                      </Link>
                    ) : (
                      <p className="text-sm text-blue-600 hover:underline cursor-pointer">{details.location}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {details.organizers && (
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Organizers</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{details.organizers.charAt(0).toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-900">{details.organizers}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Scheduling Link</label>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-600 flex-1 truncate font-medium">
              {details.schedulingLink}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8"
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpen}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-8"
            >
              Open
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
