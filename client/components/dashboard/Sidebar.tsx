"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarDays,
  Settings,
  ChevronRight,
  CalendarClock,
  RefreshCw,
  Video,
  BarChart3,
  Folder,
  ChevronsLeftRight,
  HelpCircle,
} from "lucide-react";
import { FaCoins } from "react-icons/fa6";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CREDITS_CONFIG, formatCredits } from "@/constants/dashboard-preview.constants";
import { Logo } from "../ui/logo";
import { useCurrentUser } from "@/hook/store/use-auth-store";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

const calendarScheduleItems = [
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    icon: CalendarClock,
  },
  {
    title: "Calendar Sync",
    href: "/dashboard/calendar-sync",
    icon: RefreshCw,
  },
  {
    title: "Meetings",
    href: "/dashboard/meetings",
    icon: Video,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const footerItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

const SidebarDashboard = () => {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const { checkAuthStatus } = useAuthStore();
  const { state } = useSidebar();
  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuthStatus();
    }
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  };

  const getDisplayName = () => {
    if (!user) return "User";
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return fullName || user.username || user.email || "User";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex items-center gap-2 leading-none">
                  {state === "collapsed" ? (
                    <Image 
                      src="/images/logo.png"
                      width={28}
                      height={28}
                      alt="Logo"
                    />
                  ) : (
                    <Logo size="sm" />
                  )}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {calendarScheduleItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href} className="">
                    <SidebarMenuButton asChild isActive={isActive} className="">
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12 group-data-[collapsible=icon]:h-auto">
              <div className="flex items-center gap-2 min-w-0">
                <FaCoins className="h-4 w-4 text-persian-blue-600 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {formatCredits(CREDITS_CONFIG.available)} {CREDITS_CONFIG.label}
                  </span>
                  <span className="text-[10px] text-persian-blue-600 hover:underline cursor-pointer">
                    {CREDITS_CONFIG.upgradeText}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {footerItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/profile">
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="bg-persian-blue-100 text-persian-blue-700 font-semibold">
                    {isLoading ? "..." : getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium text-sm truncate">
                    {isLoading ? "Loading..." : getDisplayName()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {isLoading ? "..." : user?.email || "No email"}
                  </span>
                </div>
                <ChevronRight className="ml-auto size-4" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarDashboard;