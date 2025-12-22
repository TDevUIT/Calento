"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/user-dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, Settings, CreditCard, LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { getUserInitials, getUserFullName } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/constants/routes";

interface UserAvatarMenuProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
}

export function UserAvatarMenu(props?: UserAvatarMenuProps) {
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoading);
  const logoutFromStore = useAuthStore((state) => state.logout);
  
  const userName = props?.userName || (user ? getUserFullName(user) : "Guest");
  const userEmail = props?.userEmail || user?.email || "guest@example.com";
  const userInitials = props?.userInitials || getUserInitials(user);

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutFromStore();
      router.push(AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    router.push(PROTECTED_ROUTES.DASHBOARD_PROFILE);
  };

  const handleSettingsClick = () => {
    router.push(PROTECTED_ROUTES.DASHBOARD_SETTINGS);
  };

  const handleBillingClick = () => {
    router.push(PROTECTED_ROUTES.BILLING);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full"
                disabled={isLoadingUser}
              >
                {isLoadingUser ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {userInitials}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBillingClick} className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-red-600 focus:text-red-600"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>Account</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
