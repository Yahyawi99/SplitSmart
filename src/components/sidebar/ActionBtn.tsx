"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@base-ui/react";
import { Plus } from "lucide-react";

export default () => {
  const { open } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="-mt-4">
        <Button
          // onClick={onNewGroup}
          className={`bg-(--accent-btn) hover:bg-(--accent-btn-hover) text-(--text-primary) gap-2 h-10 rounded-lg text-sm font-semibold cursor-pointer w-full flex items-center justify-center ${
            open ? "px-5" : "px-0 py-0"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className={`text-sm font-medium ${!open && "hidden"}`}>
            New Group
          </span>
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
