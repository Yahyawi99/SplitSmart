"use client";

import { useState } from "react";
import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "system" | "dark" | "light";

const themeOptions = [
  { value: "system" as const, label: "System", Icon: Monitor },
  { value: "dark" as const, label: "Dark", Icon: Moon },
  { value: "light" as const, label: "Light", Icon: Sun },
];

export function ThemeMenu() {
  const [activeTheme, setActiveTheme] = useState<Theme>("system");
  const ActiveThemeIcon =
    themeOptions.find(({ value }) => value === activeTheme)?.Icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative flex h-8 cursor-pointer items-center justify-center gap-2 rounded-sm border border-(--text-dim) px-2 text-(--accent-btn) hover:bg-(--accent-btn)/25"
        aria-label="Change theme"
      >
        <ActiveThemeIcon className="h-3.5 w-3.5" />
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-30 rounded-sm bg-(--bg-base) p-0 ring-(--text-dim)/50"
      >
        {themeOptions.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            className="cursor-pointer rounded-none hover:bg-(--accent-btn)/25"
            onClick={() => setActiveTheme(value)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
