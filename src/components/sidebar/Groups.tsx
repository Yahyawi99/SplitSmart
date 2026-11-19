"use client";
import { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { fetchGroups } from "@/services/groups/fetch-groups";
import type { GroupListItem } from "@/types/group";
import { UserGroup } from "lucide-react";

export default function Groups() {
  const { open } = useSidebar();
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchGroups(1, controller.signal)
      .then(({ groups: fetchedGroups, hasMore: moreGroups }) => {
        setGroups(fetchedGroups);
        setHasMore(moreGroups);
      })
      .catch((fetchError: unknown) => {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch groups:", fetchError);
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  async function loadMore() {
    if (loading) return;

    setLoading(true);
    setError(false);
    try {
      const nextPage = page + 1;
      const result = await fetchGroups(nextPage);
      setGroups((currentGroups) => [...currentGroups, ...result.groups]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (fetchError) {
      console.error("Failed to fetch more groups:", fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "h-auto opacity-100 mb-2" : " h-0 opacity-0"
        }`}
      >
        GROUPS
      </SidebarGroupLabel>
      <SidebarGroupContent>
        {groups.map((group) => (
          <div
            key={group.id}
            className={`flex items-center rounded-md mb-1 bg-(--accent-btn)/25 p-3.5 transition-all duration-300 ease-in-out ${
              open
                ? "justify-between"
                : "mt-10 p-0! w-[95%] h-10 justify-center"
            }`}
            title={group.name}
          >
            <div className="flex gap-2 items-center min-w-0">
              <UserGroup className="w-4 h-4 shrink-0" />
              <h2
                className={`whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out ${
                  !open && "hidden"
                }`}
              >
                {group.name}
              </h2>
            </div>
            <p
              className={`text-(--text-dim) whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                open ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              {group.currency}
            </p>
          </div>
        ))}
        {open && loading && (
          <p className="px-3 py-2 text-sm">Loading groups...</p>
        )}
        {open && error && (
          <p className="px-3 py-2 text-sm">Could not load groups.</p>
        )}
        {open && !loading && !error && groups.length === 0 && (
          <p className="px-3 py-2 text-sm">No groups yet.</p>
        )}
        {open && hasMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="w-full px-3 py-2 text-left text-sm hover:bg-(--accent-btn)/25 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
