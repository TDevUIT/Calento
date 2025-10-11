import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import SidebarDashboard from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Sparkles, Command, Calendar, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthProvider } from "@/components/providers";
import { Toaster } from "sonner";
import { QueryProvider } from "@/provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <QueryProvider>
        <AuthProvider>
        <SidebarProvider>
        <SidebarDashboard />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white dark:bg-slate-950">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between gap-4">
              <h1 className="text-lg font-semibold">Dashboard</h1>
              
              <div className="flex items-center gap-2">
                <div className="relative hidden md:flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-9 pr-12 w-64 h-9"
                  />
                  <kbd className="absolute right-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <Command className="h-3 w-3" />K
                  </kbd>
                </div>

                <Button variant="outline" size="sm" className="h-9 hidden lg:flex gap-2">
                  <Plus className="h-4 w-4" />
                  <span>New Event</span>
                </Button>

                <Button variant="outline" size="sm" className="h-9 hidden lg:flex gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule</span>
                </Button>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500">
                    3
                  </Badge>
                </Button>

                <Button size="sm" className="h-9 bg-persian-blue-600 hover:bg-persian-blue-700 gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Upgrade</span>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    
      </AuthProvider>
      <Toaster />
    </QueryProvider>
    
    </>
  );
}