"use client";

import { Clock, Edit, Copy, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface SchedulingLinkCardProps {
  title: string;
  description: string;
  duration: string;
  onClick: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  bookingUrl?: string;
  location?: string;
  locationLink?: string;
}

export const SchedulingLinkCard = ({
  title,
  description,
  duration,
  onClick,
  onEdit,
  onCopy,
  bookingUrl,
  location,
  locationLink
}: SchedulingLinkCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      toast.info("Edit functionality");
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy();
    } else if (bookingUrl) {
      navigator.clipboard.writeText(bookingUrl);
      toast.success("Link copied to clipboard!");
    } else {
      toast.info("Copy functionality");
    }
  };

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("More options");
  };

  return (
    <div 
      className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">T</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors" 
            onClick={handleEdit}
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors" 
            onClick={handleCopy}
            title="Copy link"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            className="p-1.5 hover:bg-gray-100 rounded transition-colors" 
            onClick={handleMore}
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <h3 className="font-bold text-gray-900 text-xl mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        {description}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <img
            className="h-4 w-auto"
            src="/Google_Meet_icon.svg"
            alt=""
            aria-hidden="true"
            role="presentation"
          />
          {locationLink ? (
            <a
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {location || 'Google Meet'}
            </a>
          ) : (
            <span className="text-blue-600 font-medium">{location || 'Google Meet'}</span>
          )}
        </div>
      </div>
    </div>
  );
};
