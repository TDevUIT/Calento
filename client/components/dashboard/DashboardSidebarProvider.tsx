'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { useControllerStore } from '@/store/controller.store';

interface DashboardSidebarProviderProps {
  children: React.ReactNode;
}

export function DashboardSidebarProvider({ children }: DashboardSidebarProviderProps) {
  const { expandedSidebar, setExpandedSidebar } = useControllerStore();

  return (
    <SidebarProvider
      open={expandedSidebar}
      onOpenChange={setExpandedSidebar}
    >
      {children}
    </SidebarProvider>
  );
}
