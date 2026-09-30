import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";


import "@/app/globals.css";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  
  return (
    <SidebarProvider>
          <AppSidebar />

          <SidebarInset >{children}</SidebarInset>
    </SidebarProvider>
  );
}
