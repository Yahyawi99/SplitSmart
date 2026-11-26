"use client";

import { useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Monitor, Moon, Sun, User, Layout } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dialogContentClass } from "./dialog-styles";

const themeOptions = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

type SettingsTab = "general" | "user";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: SettingsTab;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export function SettingsDialog({
  open,
  onOpenChange,
  defaultTab = "general",
  user,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account and app preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex w-full gap-1 bg-(--bg-base) rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-(--accent-btn) text-(--text-primary)"
                  : "text-(--text-secondary) hover:bg-(--bg-active)"
              }`}
            >
              <Layout className="h-4 w-4" />
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "user"
                  ? "bg-(--accent-btn) text-(--text-primary)"
                  : "text-(--text-secondary) hover:bg-(--bg-active)"
              }`}
            >
              <User className="h-4 w-4" />
              User
            </button>
          </div>

          {activeTab === "general" && (
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
          )}

          {activeTab === "user" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-16 w-16 shrink-0 rounded-full border border-(--text-dim) object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-(--accent-btn)/30 bg-(--accent-btn)/25 text-sm font-semibold text-(--accent-btn)">
                    {user?.name.slice(0, 2).toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-medium text-(--text-primary)">
                    {user?.name ?? "Unknown user"}
                  </p>
                  <p className="text-xs opacity-60 truncate max-w-xs">
                    {user?.email ?? ""}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-(--text-muted)">
                  Profile details coming soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
