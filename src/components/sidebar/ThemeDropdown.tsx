"use client";

import { useTheme } from "next-themes";
import { themeOptions } from "@/constants/ThemeOptions";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeMenu } from "../shared";

export default function ThemeDropdown() {
  const { open } = useSidebar();
  const { theme: activeTheme, setTheme } = useTheme();


  if (!open) {
    return <ThemeMenu />;
  }

  return (
    <div className="flex w-full items-center justify-between text-sm">
      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
        Theme
      </span>
      <div className="flex gap-1 rounded-lg border border-(--text-dim) p-1">
        {themeOptions.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={`Use ${label.toLowerCase()} theme`}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
              activeTheme === value
                ? "bg-(--accent-btn)/25 text-(--accent-btn)"
                : "hover:bg-(--accent-btn)/25 hover:text-(--accent-btn)"
            }`}
            title={`${label} Theme`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
