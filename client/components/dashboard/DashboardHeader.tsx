"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatarMenu } from "./UserAvatarMenu";
import GlobalSearchDialog from "./GlobalSearchDialog";
import { useEvents } from "@/hook/event";
import { useTasks } from "@/hook/task";
import { useBookingLinks } from "@/hook/booking";
import { logger } from "@/utils";
import { toast } from "sonner";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export function DashboardHeader({ notificationCount = 3 }: DashboardHeaderProps) {
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
  
  const handleSearch = () => {
    setOpenSearchDialog(true);
  };

  const handleNotifications = () => {
    logger.info('Notifications feature coming soon', {
      component: 'DashboardHeader',
      action: 'OPEN_NOTIFICATIONS'
    });
    toast.info('Notifications feature coming soon!');
  };

  return (
    <header className="flex h-14 items-center border-b gap-3 px-4 bg-white flex-shrink-0 z-50">
      <SidebarTrigger className="-ml-1" />
      
      <div className="flex flex-1 items-center gap-3">
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
              <p>Search (⌘K / Ctrl+K)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div id="dashboard-header-calendar-slot" className="flex flex-1 items-center min-w-0" />

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
