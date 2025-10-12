"use client";

import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import SidebarDashboard from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Sparkles, Plus, Calendar, MessageSquare } from "lucide-react";
import { AuthProvider } from "@/components/providers";
import { Toaster } from "sonner";
import { QueryProvider } from "@/provider";
import { usePathname } from "next/navigation";
import { ChatBox } from "@/components/calendar/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [showChatBox, setShowChatBox] = useState(false);

  return (
    <>
    <QueryProvider>
        <AuthProvider>
        <SidebarProvider>
        <SidebarDashboard />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <header className="flex h-14 items-center gap-3 border-b px-4 bg-white flex-shrink-0 z-50">
            <SidebarTrigger className="-ml-1" />
            
            <div className="flex flex-1 items-center gap-3">
              <Select defaultValue="calendar">
                <SelectTrigger className="w-[240px] h-9 border-0 bg-transparent hover:bg-accent font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Next:</span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">My Calendar - Week View</SelectItem>
                  <SelectItem value="today">Today&apos;s Schedule</SelectItem>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="team">Team Calendar</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Calendar className="h-4 w-4" />
              </Button>

              <Button variant="default" size="sm" className="h-9 gap-2">
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>

              <span className="flex-1" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        JD
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button size="sm" className="h-9 bg-persian-blue-600 hover:bg-persian-blue-700 gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Upgrade</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-2 pb-10 scroll-smooth">
            {children}
          </main>
        </SidebarInset>
        {showChatBox && (
          <div 
            className="fixed right-0 top-14 w-[440px] animate-in slide-in-from-right duration-300 z-[60]"
            style={{ height: 'calc(100vh - 3.5rem)' }}
          >
            <ChatBox onClose={() => setShowChatBox(false)} />
          </div>
        )}

        {!showChatBox && (
          <button
            onClick={() => setShowChatBox(true)}
            className="fixed bottom-6 right-6 h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-[100] group animate-in fade-in slide-in-from-bottom-4"
            aria-label="Open AI Chat Assistant"
          >
            <MessageSquare className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
        )}
      </SidebarProvider>
    
      </AuthProvider>
      <Toaster />
    </QueryProvider>
    
    </>
  );
}