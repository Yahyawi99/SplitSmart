import type { Metadata } from "next";
import { Roboto_Condensed, Roboto, Oxanium } from "next/font/google";
import "./globals.css";
// Components
import Sidebar from "./components/sidebar";
import { cn } from "@/lib/utils";

const oxaniumHeading = Oxanium({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const openSans = Roboto_Condensed({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitSmart — Group Expense Splitter",
  description:
    "Record shared expenses easily, always show accurate real-time balances Minimize the pain of settling up",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("w-full", "h-full", "antialiased", openSans.className, "font-sans", roboto.variable, oxaniumHeading.variable)}
    >
      <body className="w-full h-full flex">
        <Sidebar />
        <main className="flex-1 bg-(--bg-base)">{children}</main>
      </body>
    </html>
  );
}
