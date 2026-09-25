"use client";

import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeMenu } from "../shared";

type Theme = "system" | "dark" | "light";

interface ThemeDropdownProps {
  activeTheme: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export default function ThemeDropdown({
  activeTheme,
  onThemeChange,
}: ThemeDropdownProps) {
  const { open } = useSidebar();
  const ActiveThemeIcon =
    activeTheme === "dark" ? Moon : activeTheme === "light" ? Sun : Monitor;

  const themeOptions = [
    { value: "system" as const, label: "System", Icon: Monitor },
    { value: "dark" as const, label: "Dark", Icon: Moon },
    { value: "light" as const, label: "Light", Icon: Sun },
  ];

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
            onClick={() => onThemeChange?.(value)}
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
