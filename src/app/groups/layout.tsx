
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

import "@/app/globals.css";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
          <AppSidebar />

          <SidebarInset >{children}</SidebarInset>
    </SidebarProvider>
  );
}
