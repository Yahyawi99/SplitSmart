import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { Button } from "@base-ui/react";
import { Plus } from "lucide-react";

export default () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <Button
          // onClick={onNewGroup}
          className=" bg-(--accent-btn) hover:bg-(--accent-btn-hover) text-(--text-primary) gap-2 h-10 px-5 rounded-lg text-sm font-semibold cursor-pointer w-full flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Group</span>
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
