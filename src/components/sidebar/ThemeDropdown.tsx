"use client";

import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-(--text-dim) text-(--accent-btn) hover:bg-(--accent-btn)/25"
          aria-label="Change theme"
        >
          <ActiveThemeIcon className="h-3.5 w-3.5" />
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-10 ml-5 rounded-sm bg-(--bg-base) p-0 ring-(--text-dim)/50">
          {themeOptions.map(({ value, label, Icon }) => (
            <DropdownMenuItem
              key={value}
              className="cursor-pointer rounded-none hover:bg-(--accent-btn)/25"
              onClick={() => onThemeChange?.(value)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
