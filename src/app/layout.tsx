import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
// Components
import Sidebar from "./components/sidebar";

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
      className={`${openSans.className} w-full h-full antialiased`}
    >
      <body className="w-full h-full flex">
        <Sidebar />
        <main className="flex-1 bg-(--bg-base)">{children}</main>
      </body>
    </html>
  );
}
