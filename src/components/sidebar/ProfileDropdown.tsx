"use client";

import { LogOut, MoreVertical, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";
import { ConfirmDialog, SettingsDialog } from "@/components/dialogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type User = {
  name: string;
  email: string;
  avatarUrl: string | undefined;
  isGuest: boolean;
};

interface ProfileDropdownProps {
  onSettings?: () => void;
  onLogout?: () => void;
  user: User;
}

export default function ProfileDropdown({
  onSettings,
  onLogout,
  user
}: ProfileDropdownProps) {
  const { open } = useSidebar();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    const { error } = await signOut();

    if (error) {
      console.error("Failed to log out:", error);
      setLogoutLoading(false);
      return;
    }

    onLogout?.();
    setLogoutOpen(false);
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex items-center justify-between p-1 group">
      {user && !user.isGuest ? (
        <div
          className={`flex items-center gap-3 overflow-hidden cursor-pointer ${!open && "hidden"}`}
          onClick={handleSettingsClick}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-9 w-9 shrink-0 rounded-full border border-(--text-dim) object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--accent-btn)/30 bg-(--accent-btn)/25 text-sm font-semibold text-(--accent-btn)">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col truncate">
            <span className="truncate text-sm font-medium leading-tight">
              {user.name}
            </span>
            <span className="truncate text-xs opacity-60">{user.email}</span>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col gap-2.5 p-2 rounded-lg bg-(--accent-btn)/10 border border-(--accent-btn)/20 w-full ${!open && "hidden"}`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-(--accent-btn) shrink-0" />
            <span className="text-xs font-medium leading-snug text-(--text-dim)">
              Sign up to keep this data beyond your session.
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/auth/sign-up")}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-(--accent-btn)/25 hover:bg-(--accent-btn)/40 text-(--accent-btn) border border-(--accent-btn)/30 transition-colors text-center cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      )}

      {user && !user.isGuest && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`cursor-pointer rounded-lg p-1.5 text-dim transition-colors hover:bg-(--accent-btn)/25 hover:text-(--accent-btn) ${
                !open && "grid w-full place-items-center"
              }`}
              aria-label="User Options"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-5 z-10 rounded-sm bg-(--bg-base) p-0 ring-(--text-dim)/50">
              <DropdownMenuItem
                className="cursor-pointer rounded-none hover:bg-(--accent-btn)/25"
                onClick={() => {
                  onSettings?.();
                  setSettingsOpen(true);
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-none text-red-500 hover:bg-red-500/10"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      {user && (
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          defaultTab="user"
        />
      )}

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out?"
        description="You will need to sign in again to access your groups."
        confirmLabel="Log out"
        onConfirm={handleLogout}
        destructive
      />
    </div>
  );
}
