import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

import "@/app/globals.css";
import { cn } from "@/lib/utils";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <html
        className={cn(
          "w-full",
          "h-full",
          "antialiased"
        )}
      >
        <body className=" bg-(--bg-base) text-(--text-primary)">
          <AppSidebar />

          <main className="w-full">{children}</main>
        </body>
      </html>
    </SidebarProvider>
  );
}
