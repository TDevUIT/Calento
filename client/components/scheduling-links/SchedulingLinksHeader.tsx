"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchedulingLinksHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onCreateClick: () => void;
  linkCount: number;
}

export const SchedulingLinksHeader = ({
  activeTab,
  onTabChange,
  onCreateClick,
  linkCount
}: SchedulingLinksHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Links</h1>
          <Button 
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            New link
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-transparent border-b border-gray-200 h-auto p-0 w-full justify-start">
            <TabsTrigger 
              value="my-links"
              className="
                relative px-4 py-3 text-sm font-medium text-gray-600 
                hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200
                data-[state=active]:text-blue-600 data-[state=active]:bg-transparent 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                rounded-none border-b-2 border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <span className="flex items-center gap-2">
                My links 
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-xs px-2 py-0.5"
                >
                  {linkCount}
                </Badge>
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="team-links"
              className="
                relative px-4 py-3 text-sm font-medium text-gray-600 
                hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200
                data-[state=active]:text-blue-600 data-[state=active]:bg-transparent 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                rounded-none border-b-2 border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Team links
            </TabsTrigger>
            
            <TabsTrigger 
              value="round-robin"
              className="
                relative px-4 py-3 text-sm font-medium text-gray-600 
                hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200
                data-[state=active]:text-blue-600 data-[state=active]:bg-transparent 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                rounded-none border-b-2 border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Round Robin links
            </TabsTrigger>
            
            <TabsTrigger 
              value="hidden"
              className="
                relative px-4 py-3 text-sm font-medium text-gray-600 
                hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200
                data-[state=active]:text-blue-600 data-[state=active]:bg-transparent 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                rounded-none border-b-2 border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Hidden links
            </TabsTrigger>
            
            <TabsTrigger 
              value="team"
              className="
                relative px-4 py-3 text-sm font-medium text-gray-600 
                hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200
                data-[state=active]:text-blue-600 data-[state=active]:bg-transparent 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                rounded-none border-b-2 border-transparent
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              Team
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
