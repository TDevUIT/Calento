"use client";

import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserBookingInfoProps {
  name: string;
  url: string;
}

export const UserBookingInfo = ({ name, url }: UserBookingInfoProps) => {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-base font-semibold text-gray-900">{name}</h2>
      <div className="flex items-center gap-2">
        <a 
          href="#" 
          className="text-sm text-blue-600 hover:underline"
        >
          {url}
        </a>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Copy className="h-3 w-3 text-gray-400" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </Button>
      </div>
    </div>
  );
};
