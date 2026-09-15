import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitSmart — Group Expense Splitter",
  description:
    "Record shared expenses easily, always show accurate real-time balances Minimize the pain of settling up",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${""} ${""} w-full h-full antialiased`}>
      <body className="w-full h-full flex">
        <Sidebar />
        <main className="flex-1 bg-(--bg-base)">{children}</main>
      </body>
    </html>
  );
}
