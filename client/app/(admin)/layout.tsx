import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import AdminSidebarProvider from "@/components/admin/sidebar/AdminSidebarProvider";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 items-center border-b gap-3 px-4 bg-white flex-shrink-0 z-50">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center">
            <h1 className="text-sm font-semibold">Admin</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-4 bg-background">
          {children}
        </main>
      </SidebarInset>
    </AdminSidebarProvider>
  );
}
