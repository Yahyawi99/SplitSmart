import {
  Monitor,
  Moon,
  Sun,
  MoreVertical,
  LogOut,
  Settings,
  User,
  Divide,
} from "lucide-react";

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
}: Partial<SidebarFooterProps>) => {
  return (
    <footer className="border-t border-t-(--text-dim) p-4 flex flex-col gap-4">
      {/* Theme Switcher */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
          Theme
        </span>
        <div className="flex gap-1 border border-(--text-dim) rounded-lg p-1">
          <button
            // onClick={() => onThemeChange?.("system")}
            className={`w-8 h-8 cursor-pointer rounded-md flex justify-center items-center transition-colors ${
              activeTheme === "system"
                ? "bg-(--accent-btn)/25 text-(--accent-btn)"
                : "hover:bg-(--accent-btn)/25 hover:text-(--accent-btn)"
            }`}
            title="System Theme"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button
            // onClick={() => onThemeChange?.("dark")}
            className={`w-8 h-8 cursor-pointer rounded-md flex justify-center items-center transition-colors ${
              activeTheme === "dark"
                ? "bg-(--accent-btn)/25 text-(--accent-btn)"
                : "hover:bg-(--accent-btn)/25 hover:text-(--accent-btn)"
            }`}
            title="Dark Theme"
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            // onClick={() => onThemeChange?.("light")}
            className={`w-8 h-8 cursor-pointer rounded-md flex justify-center items-center transition-colors ${
              activeTheme === "light"
                ? "bg-(--accent-btn)/25 text-(--accent-btn)"
                : "hover:bg-(--accent-btn)/25 hover:text-(--accent-btn)"
            }`}
            title="Light Theme"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-(--text-dim) opacity-30 w-full" />

      {/* User Profile Section */}
      <div className="flex items-center justify-between p-1 group">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar or Fallback Initials */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-(--text-dim)"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-(--accent-btn)/25 text-(--accent-btn) flex items-center justify-center font-semibold text-sm shrink-0 border border-(--accent-btn)/30">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* User Details */}
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium leading-tight truncate">
              {user.name}
            </span>
            <span className="text-xs opacity-60 truncate">{user.email}</span>
          </div>
        </div>

        {/* User Options Trigger */}
        <button
          className="p-1.5 rounded-lg hover:bg-(--accent-btn)/25 hover:text-(--accent-btn) cursor-pointer transition-colors text-dim"
          aria-label="User Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
