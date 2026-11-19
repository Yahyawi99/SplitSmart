import type { GroupsResponse } from "@/types/group";

export async function fetchGroups(page: number, signal?: AbortSignal) {
  const response = await fetch(`/api/groups?page=${page}`, { signal });
  if (!response.ok) {
    throw new Error(`Unable to load groups (${response.status})`);
  }
  return (await response.json()) as GroupsResponse;
}
