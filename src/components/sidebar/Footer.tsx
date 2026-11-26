"use client";

import { useSidebar } from "@/components/ui/sidebar";
import ProfileDropdown from "./ProfileDropdown";
import ThemeDropdown from "./ThemeDropdown";
import { useAuth } from "@/context/AuthProvider";

interface SidebarFooterProps {
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function SidebarFooter({
  onSettings,
  onLogout,
}: SidebarFooterProps) {
  const { open } = useSidebar();
  const { session } = useAuth();
  const user = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        avatarUrl: session.user.image ?? undefined,
        isGuest: !session.user || Boolean(session.user.isAnonymous),
      }
    : undefined;

  return (
    <footer
      className={`border-t border-t-(--text-dim)/50 p-4 flex flex-col gap-4  ${
        !open && "px-2 gap-0"
      }`}
    >
      <ThemeDropdown />

      {/* Divider */}
      <div className="h-px bg-(--text-dim) opacity-30 w-full" />

      {user && (
        <ProfileDropdown
        user= {user}
          onSettings={onSettings}
          onLogout={onLogout}
        />
      )}
    </footer>
  );
}
