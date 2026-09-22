"use client";

import React from "react";
import { Divide } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar"; // Adjust path to your sidebar component

export default () => {
  const { open } = useSidebar();

  return (
    <header className="text-(--text-primary) flex justify-start items-center gap-4 mb-1.5 pt-4 transition-all duration-300 ease-in-out">
      {/* Icon Container: Resizes to 4rem (w-16 h-16) when closed */}
      <div
        className={`bg-(--accent-btn) flex justify-center items-center rounded-sm transition-all duration-300 ease-in-out shrink-0 ${
          open ? "w-12 h-10" : "w-[95%] h-10"
        }`}
      >
        <Divide className="transition-transform duration-300" />
      </div>

      {/* App Title: Smoothly fades and collapses when sidebar is closed */}
      <h1
        className={`text-3xl font-bold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "opacity-100 w-auto translate-x-0"
            : "opacity-0 w-0 -translate-x-4 pointer-events-none"
        }`}
      >
        SplitSmart
      </h1>
    </header>
  );
};
