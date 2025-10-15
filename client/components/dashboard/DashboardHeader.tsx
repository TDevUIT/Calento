"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Sparkles, Plus, Calendar } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { ViewSelector } from "./ViewSelector";
import { UserAvatarMenu } from "./UserAvatarMenu";
import { UpcomingEvents } from "./UpcomingEvents";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export function DashboardHeader({ notificationCount = 3 }: DashboardHeaderProps) {
  const handleNewTask = () => {
    console.log("Creating new task...");
  };

  const handleSearch = () => {
    console.log("Opening search...");
  };

  const handleCalendarView = () => {
    console.log("Opening calendar view...");
  };

  const handleNotifications = () => {
    console.log("Opening notifications...");
  };

  const handleUpgrade = () => {
    console.log("Opening upgrade page...");
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4 bg-white flex-shrink-0 z-50">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex flex-1 items-center gap-3">
        {/* <ViewSelector /> */}
        
        <UpcomingEvents />

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={handleCalendarView}
        >
          <Calendar className="h-4 w-4" />
        </Button>

        <Button 
          variant="default" 
          size="sm" 
          className="h-9 gap-2"
          onClick={handleNewTask}
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>

        <span className="flex-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9"
                onClick={handleNotifications}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <UserAvatarMenu />

        <Button 
          size="sm" 
          className="h-9 bg-persian-blue-600 hover:bg-persian-blue-700 gap-2"
          onClick={handleUpgrade}
        >
          <Sparkles className="h-4 w-4" />
          <span>Upgrade</span>
        </Button>
      </div>
    </header>
  );
}
