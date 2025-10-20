"use client";

import { useState, useEffect } from "react";
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
import { UserAvatarMenu } from "./UserAvatarMenu";
import { UpcomingEvents } from "./UpcomingEvents";
import { CreateTaskDropdown } from "@/components/task/CreateTaskDropdown";
import GlobalSearchDialog from "./GlobalSearchDialog";
import { useEvents } from "@/hook/event";
import { useTasks } from "@/hook/task";
import { useBookingLinks } from "@/hook/booking";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export function DashboardHeader({ notificationCount = 3 }: DashboardHeaderProps) {
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  
  const { data: eventsData } = useEvents({ page: 1, limit: 50 });
  const { data: tasksData } = useTasks({ page: 1, limit: 50 });
  const { data: bookingLinks } = useBookingLinks();
  
  const events = eventsData?.data?.items || [];
  const tasks = tasksData?.data?.items || [];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpenSearchDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const handleNewTask = () => {
    setOpenTaskDialog(true);
  };

  const handleSearch = () => {
    setOpenSearchDialog(true);
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
        
        <UpcomingEvents />

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={handleCalendarView}
        >
          <Calendar className="h-4 w-4" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search (⌘K)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="flex-1" />
        <CreateTaskDropdown 
          open={openTaskDialog} 
          onOpenChange={setOpenTaskDialog} 
        >
          <button 
            className="h-9 gap-2 flex items-center hover:bg-gray-100 hover:rounded-xl p-2" 
            onClick={handleNewTask}
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </CreateTaskDropdown>
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
      
      <GlobalSearchDialog
        open={openSearchDialog}
        onOpenChange={setOpenSearchDialog}
        events={events}
        tasks={tasks}
        bookingLinks={bookingLinks}
      />
    </header>
  );
}
