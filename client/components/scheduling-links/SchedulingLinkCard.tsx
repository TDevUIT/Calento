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
}

export const SchedulingLinkCard = ({
  title,
  description,
  duration,
  onClick,
  onEdit,
  onCopy,
  bookingUrl
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
      {/* Top Icons and Actions */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Calendar Icon */}
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* User Avatar */}
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">T</span>
          </div>
        </div>
        
        {/* Action Buttons */}
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
      
      {/* Title and Description */}
      <h3 className="font-bold text-gray-900 text-xl mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        {description}
      </p>
      
      {/* Duration and Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M3 8L10.89 13.26C11.56 13.67 12.44 13.67 13.11 13.26L21 8M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11L10 12L13 9" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="15" cy="11" r="2" fill="#34A853"/>
            <path d="M18 14L19 15" stroke="#FBBC04" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-blue-600 font-medium">Google Meet</span>
        </div>
      </div>
    </div>
  );
};
