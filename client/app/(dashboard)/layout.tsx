import { SidebarInset } from "@/components/ui/sidebar";
import SidebarDashboard from "@/components/dashboard/Sidebar";
import { DashboardProviders } from "@/components/dashboard/DashboardProviders";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChatButton } from "@/components/dashboard/ChatButton";
import { DashboardSidebarProvider } from "@/components/dashboard/DashboardSidebarProvider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProviders>
      <DashboardSidebarProvider>
        <SidebarDashboard />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <DashboardHeader notificationCount={3} />
          <main className="flex-1 overflow-y-auto px-2 pb-10 scroll-smooth">
            {children}
          </main>
        </SidebarInset>
        <ChatButton />
      </DashboardSidebarProvider>
    </DashboardProviders>
  );
}