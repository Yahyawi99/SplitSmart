"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { SettingsDialog } from "@/components/dialogs";

interface HeaderProps {
  groupId?: string;
  onSettings?: () => void;
}

export function Header({ groupId, onSettings }: Partial<HeaderProps>) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-(--bg-sidebar) text-(--text-primary)">
        <div className="flex justify-between pt-3 px-2 pb-2 border-b border-b-(--text-dim)/50 mb-5">
          <SidebarTrigger />

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                onSettings?.();
                setSettingsOpen(true);
              }}
              className="cursor-pointer border-(--text-dim)/50 bg-transparent text-(--text-primary) hover:bg-(--bg-active) hover:text-(--text-primary)"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
