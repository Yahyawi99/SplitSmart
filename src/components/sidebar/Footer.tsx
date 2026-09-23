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
  onNewGroup?: () => void;
  onThemeChange?: (theme: "system" | "dark" | "light") => void;
  activeTheme?: "system" | "dark" | "light";
  onSettings?: () => void;
  onLogout?: () => void;
}

export default ({
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "",
  },
  onNewGroup,
  onThemeChange,
  activeTheme = "system",
  onSettings,
  onLogout,
}: Partial<SidebarFooterProps>) => {
  const { open } = useSidebar();

  return (
    <footer
      className={`border-t border-t-(--text-dim)/50 p-4 flex flex-col gap-4  ${
        !open && "px-2 gap-0"
      }`}
    >
      <ThemeDropdown activeTheme={activeTheme} onThemeChange={onThemeChange} />

      {/* Divider */}
      <div className="h-px bg-(--text-dim) opacity-30 w-full" />

      <ProfileDropdown
        user={user}
        onSettings={onSettings}
        onLogout={onLogout}
      />
    </footer>
  );
};
