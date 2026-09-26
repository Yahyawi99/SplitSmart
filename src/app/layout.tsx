import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { Roboto_Condensed, Roboto, Oxanium } from "next/font/google";

import "./globals.css";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn(
        "w-full",
        "h-full",
        "antialiased",
        openSans.className,
        roboto.variable,
        oxaniumHeading.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-(--bg-base) text-(--text-primary)">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
