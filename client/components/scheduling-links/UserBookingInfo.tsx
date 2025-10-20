"use client";

import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserBookingInfoProps {
  name: string;
  url: string;
}

export const UserBookingInfo = ({ name, url }: UserBookingInfoProps) => {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success("Booking page URL copied to clipboard!");
  };

  const handleOpen = () => {
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-4">
      <h2 className="text-base font-semibold text-gray-900">{name}</h2>
      <div className="flex items-center gap-2">
        <a 
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {url}
        </a>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={handleCopy}
          title="Copy URL"
        >
          <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={handleOpen}
          title="Open in new tab"
        >
          <ExternalLink className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
