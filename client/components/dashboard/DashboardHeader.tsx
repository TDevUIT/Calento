"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, RefreshCw, CalendarClock } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatarMenu } from "./UserAvatarMenu";
import GlobalSearchDialog from "./GlobalSearchDialog";
import { useEvents } from "@/hook/event";
import { useTasks } from "@/hook/task";
import { useBookingLinks } from "@/hook/booking";
import { logger } from "@/utils";
import { toast } from "sonner";
import { usePendingNotifications } from "@/hook/notification";
import { notificationService } from "@/service";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export function DashboardHeader({ notificationCount = 3 }: DashboardHeaderProps) {
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const router = useRouter();
  const pendingNotificationsQuery = usePendingNotifications();
  
  const { data: eventsData } = useEvents({ page: 1, limit: 50 });
  const { data: tasksData } = useTasks({ page: 1, limit: 50 });
  const { data: bookingLinks } = useBookingLinks();
  
  const events = eventsData?.data?.items || [];
  const tasks = tasksData?.data?.items || [];

  const pendingNotifications = Array.isArray(pendingNotificationsQuery.data)
    ? pendingNotificationsQuery.data
    : [];
  const pendingCount = pendingNotifications.length;

  const notificationBadgeCount = useMemo(() => {
    if (pendingNotificationsQuery.isLoading) return notificationCount;
    return pendingCount;
  }, [pendingCount, pendingNotificationsQuery.isLoading, notificationCount]);
  
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

  const handleRefreshNotifications = async () => {
    try {
      await pendingNotificationsQuery.refetch();
    } catch (error) {
      logger.error('Failed to refresh notifications', error);
      toast.error('Failed to refresh notifications');
    }
  };

  const handleScheduleReminders = async () => {
    try {
      const result = await notificationService.scheduleNotificationReminders();
      toast.success(`Scheduled ${result.scheduled} reminder(s)`);
      await pendingNotificationsQuery.refetch();
    } catch (error) {
      logger.error('Failed to schedule reminders', error);
      toast.error('Failed to schedule reminders');
    }
  };

  const handleOpenNotification = (eventId: string) => {
    router.push(`/events/${eventId}`);
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
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                  >
                    <Bell className="h-5 w-5" />
                    {notificationBadgeCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
                        {notificationBadgeCount > 9 ? '9+' : notificationBadgeCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent align="end" className="w-96">
                <div className="flex items-center justify-between p-2">
                  <div className="flex flex-col">
                    <p className="font-semibold">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Pending email reminders
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleScheduleReminders}
                    >
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleRefreshNotifications}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {pendingNotificationsQuery.isLoading ? (
                  <div className="p-4 text-sm text-muted-foreground">Loading...</div>
                ) : pendingNotificationsQuery.isError ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Failed to load notifications
                  </div>
                ) : pendingNotifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pending reminders</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {pendingNotifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem
                        key={n.notification_id}
                        className="p-3 cursor-pointer"
                        onClick={() => handleOpenNotification(n.event_id)}
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="text-sm font-medium truncate">{n.title || 'Untitled event'}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {n.start_time ? new Date(n.start_time).toLocaleString() : 'No start time'}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
