"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@wrksz/themes/client";
import {
  Monitor,
  Moon,
  Sun,
  User,
  Layout,
  Sparkles,
  Pencil,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthProvider";
import { updateUser } from "@/lib/auth-client";
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
}

export function SettingsDialog({
  open,
  onOpenChange,
  defaultTab = "general",
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);
  const { theme, setTheme } = useTheme();
  const { session } = useAuth();
  const router = useRouter();

  const user = session?.user;
  const isGuest = !user || Boolean(user.isAnonymous);

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form state when user data loads or dialog opens
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImage(user.image ?? "");
    }
  }, [user, open]);

  const handleSignUpClick = () => {
    onOpenChange(false);
    router.push("/auth/sign-up");
  };

  const handleCancelEdit = () => {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
    setError(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (updateError) {
        setError(updateError.message ?? "Failed to update profile.");
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleCancelEdit();
        onOpenChange(val);
      }}
    >
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
              onClick={() => {
                setActiveTab("general");
                handleCancelEdit();
              }}
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
                    className={`flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors ${
                      theme === value
                        ? "border-(--accent-btn) bg-(--accent-btn)/10 text-(--accent-btn)"
                        : "border-(--text-dim)/50 bg-(--bg-base) text-(--text-secondary) hover:bg-(--bg-active)"
                    }`}
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
              {isEditing && !isGuest ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    {image ? (
                      <img
                        src={image}
                        alt={name || "Avatar preview"}
                        className="h-16 w-16 shrink-0 rounded-full border border-(--text-dim) object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-(--accent-btn)/30 bg-(--accent-btn)/25 text-sm font-semibold text-(--accent-btn)">
                        {name ? name.slice(0, 2).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-(--text-dim)">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        disabled={isSaving}
                        className="w-full rounded-lg border border-(--text-dim)/30 bg-(--bg-base) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--accent-btn)"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-(--text-dim)">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        disabled={isSaving}
                        className="w-full rounded-lg border border-(--text-dim)/30 bg-(--bg-base) px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--accent-btn)"
                      />
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 rounded-lg border border-(--text-dim)/30 bg-(--bg-base) px-3 py-1.5 text-xs font-medium text-(--text-secondary) transition-colors hover:bg-(--bg-active) cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 rounded-lg border border-(--accent-btn)/30 bg-(--accent-btn)/25 px-3 py-1.5 text-xs font-semibold text-(--accent-btn) transition-colors hover:bg-(--accent-btn)/40 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="relative flex flex-col items-center gap-3">
                    {!isGuest && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit profile"
                        className="absolute right-0 top-0 flex items-center gap-1 rounded-lg border border-(--text-dim)/30 bg-(--bg-base) px-2.5 py-1 text-xs font-medium text-(--text-secondary) transition-colors hover:border-(--accent-btn)/40 hover:text-(--accent-btn) cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    )}

                    {user?.image && !isGuest ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-16 w-16 shrink-0 rounded-full border border-(--text-dim) object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-(--accent-btn)/30 bg-(--accent-btn)/25 text-sm font-semibold text-(--accent-btn)">
                        {isGuest
                          ? "GU"
                          : user?.name
                            ? user.name.slice(0, 2).toUpperCase()
                            : "?"}
                      </div>
                    )}

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <p className="font-medium text-(--text-primary)">
                          {isGuest
                            ? "Guest User"
                            : (user?.name ?? "Unknown user")}
                        </p>
                        {isGuest && (
                          <span className="rounded-full border border-(--accent-btn)/30 bg-(--accent-btn)/15 px-2 py-0.5 text-[10px] font-medium text-(--accent-btn)">
                            Temporary
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-60 truncate max-w-xs">
                        {isGuest ? "Anonymous session" : (user?.email ?? "")}
                      </p>
                    </div>
                  </div>

                  {isGuest ? (
                    <div className="flex flex-col gap-3 rounded-lg border border-(--accent-btn)/20 bg-(--accent-btn)/10 p-3">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-(--accent-btn)" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-(--text-primary)">
                            Guest Account
                          </p>
                          <p className="text-xs leading-relaxed text-(--text-dim)">
                            Sign up to keep this data beyond your session and
                            sync across devices.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignUpClick}
                        className="w-full cursor-pointer rounded-lg border border-(--accent-btn)/30 bg-(--accent-btn)/25 px-3 py-1.5 text-center text-xs font-semibold text-(--accent-btn) transition-colors hover:bg-(--accent-btn)/40"
                      >
                        Sign Up
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-(--text-dim)/20 bg-(--bg-base) p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-(--text-dim)">Email Status</span>
                        <span
                          className={
                            user?.emailVerified
                              ? "font-medium text-(--accent-btn)"
                              : "text-(--text-secondary)"
                          }
                        >
                          {user?.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                      {user?.createdAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-(--text-dim)">
                            Member Since
                          </span>
                          <span className="text-(--text-secondary)">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
