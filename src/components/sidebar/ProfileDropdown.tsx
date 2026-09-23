"use client";

import { LogOut, MoreVertical, Settings } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface ProfileDropdownProps {
  user: UserProfile;
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function ProfileDropdown({
  user,
  onSettings,
  onLogout,
}: ProfileDropdownProps) {
  const { open } = useSidebar();

  return (
    <div className="flex items-center justify-between p-1 group">
      <div
        className={`flex items-center gap-3 overflow-hidden ${!open && "hidden"}`}
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
            onClick={onSettings}
          >
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-none text-red-500 hover:bg-red-500/10"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
