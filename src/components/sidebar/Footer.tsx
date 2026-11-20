"use client";

import { useSidebar } from "@/components/ui/sidebar";
import ProfileDropdown from "./ProfileDropdown";
import ThemeDropdown from "./ThemeDropdown";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarFooterProps {
  user?: UserProfile;
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function SidebarFooter({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "",
  },
  onSettings,
  onLogout,
}: Partial<SidebarFooterProps>) {
  const { open } = useSidebar();

  return (
    <footer
      className={`border-t border-t-(--text-dim)/50 p-4 flex flex-col gap-4  ${
        !open && "px-2 gap-0"
      }`}
    >
      <ThemeDropdown />

      {/* Divider */}
      <div className="h-px bg-(--text-dim) opacity-30 w-full" />

      <ProfileDropdown
        user={user}
        onSettings={onSettings}
        onLogout={onLogout}
      />
    </footer>
  );
}
