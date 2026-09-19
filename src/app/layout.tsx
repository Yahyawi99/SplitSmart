import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import type { Metadata } from "next";
import { Roboto_Condensed, Roboto, Oxanium } from "next/font/google";
import "./globals.css";
// Components
import { cn } from "@/lib/utils";

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
});

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const openSans = Roboto_Condensed({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitSmart — Group Expense Splitter",
  description:
    "Record shared expenses easily, always show accurate real-time balances Minimize the pain of settling up",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <html
        className={cn(
          "w-full",
          "h-full",
          "antialiased",
          openSans.className,
          "font-sans",
          roboto.variable,
          oxaniumHeading.variable,
        )}
      >
        <body className=" bg-(--bg-base)">
          <AppSidebar />

          <main>{children}</main>
        </body>
      </html>
    </SidebarProvider>
  );
}
