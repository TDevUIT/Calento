"use client";

import { Edit, MoreVertical, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LinkDetails {
  title: string;
  description: string;
  group: string;
  duration: string;
  hours: string;
  calendar: string;
  dates: string;
  location: string;
  organizers: string;
  schedulingLink: string;
}

interface DetailsContentProps {
  details: LinkDetails;
}

export const DetailsContent = ({ details }: DetailsContentProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(details.schedulingLink);
  };

  const handleOpen = () => {
    window.open(details.schedulingLink, '_blank');
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {details.title}
            </h1>
            <p className="text-gray-600">
              {details.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Group
              </label>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {details.group}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Duration
              </label>
              <p className="text-gray-900">{details.duration}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Hours
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{details.hours}</p>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Calendar
              </label>
              <p className="text-gray-900">{details.calendar}</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Dates
              </label>
              <p className="text-gray-900">{details.dates}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Location
              </label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </div>
                <p className="text-gray-900">{details.location}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Organizers
              </label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">T</span>
                </div>
                <p className="text-gray-900">{details.organizers}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Scheduling Link
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-blue-600 flex-1 truncate">
                {details.schedulingLink}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                className="text-blue-600 hover:text-blue-700"
              >
                Copy
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleOpen}
                className="text-blue-600 hover:text-blue-700"
              >
                Open
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
