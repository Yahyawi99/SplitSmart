"use client";

import { useTheme } from "@wrksz/themes/client";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogContentClass } from "./dialog-styles";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const themeOptions = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Choose how SplitSmart appears on this device.
          </DialogDescription>
        </DialogHeader>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Appearance</legend>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
                className={`flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors ${theme === value ? "border-(--accent-btn) bg-(--accent-btn)/10 text-(--accent-btn)" : "border-(--text-dim)/50 bg-(--bg-base) text-(--text-secondary) hover:bg-(--bg-active)"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
