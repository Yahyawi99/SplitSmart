export const dialogContentClass =
  "max-h-[90vh] overflow-y-auto rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-6 text-(--text-primary) ring-0 sm:max-w-lg";

export const dialogFieldClass =
  "h-10 w-full rounded-md border border-(--text-dim)/50 bg-(--bg-base) px-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus-visible:border-(--accent-btn) focus-visible:ring-0";

export const dialogPrimaryButtonClass =
  "h-10 w-full rounded-lg bg-(--accent-btn) text-(--text-primary) hover:bg-(--accent-btn-hover)/80";

export const dialogErrorClass =
  "rounded-md border border-(--accent-red)/30 bg-(--accent-red)/10 p-3 text-sm text-(--accent-red-hover)";

export type GroupMemberOption = {
  id: string;
  name: string;
};

export async function fetchGroupMembers(groupId: string) {
  const response = await fetch(`/api/groups/${groupId}/members`);
  const result = (await response.json()) as {
    members?: GroupMemberOption[];
    error?: string;
  };
  if (!response.ok) {
    throw new Error(result.error ?? "Could not load group members");
  }
  return result.members ?? [];
}
