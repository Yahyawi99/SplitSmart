import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserGroup } from "lucide-react";

export default () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>GROUPS</SidebarGroupLabel>
      {/* active state : bg-(--accent-blue)/25 and disable the cursor  */}
      <SidebarGroupContent>
        <div className="flex items-center justify-between hover:bg-(--accent-btn)/25 rounded-md cursor-pointer mb-1 bg-(--accent-btn)/25 p-4">
          <div className="flex gap-2 items-center">
            <UserGroup className="w-4 h-4" />
            <h2>Trip to Japan</h2>
          </div>
          <p className="text-(--accent-green)">+$216.74</p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
