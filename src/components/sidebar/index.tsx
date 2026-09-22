import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Divide, UserGroup } from "lucide-react";
import { Footer } from "./Footer";

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-r-(--text-dim)">
      <SidebarHeader className="bg-(--bg-sidebar)">
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className="bg-(--bg-sidebar)">
        <Groups />
        <ActionBtn />
      </SidebarContent>
      <SidebarFooter className="bg-(--bg-sidebar)">
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}

const HeaderContent = () => {
  return (
    <header className="text-(--text-primary) flex justify-start items-center gap-4 mb-1.5 pt-4">
      <div className="bg-(--accent-btn) w-12 h-10 rounded-sm flex justify-center items-center">
        <Divide />
      </div>

      <h1 className="text-3xl">SplitSmart</h1>
    </header>
  );
};

const Groups = () => {
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

const ActionBtn = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <Button
          // onClick={onNewGroup}
          className=" bg-(--accent-btn) hover:bg-(--accent-btn-hover) text-(--text-primary) gap-2 h-10 px-5 rounded-lg text-sm font-semibold cursor-pointer w-full"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Group</span>
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
