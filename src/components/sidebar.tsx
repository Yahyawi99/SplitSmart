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
import { faDivide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus, Monitor, Moon, Sun } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className=" bg-(--bg-sidebar)">
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className=" bg-(--bg-sidebar)">
        <Group />
      </SidebarContent>
      <SidebarFooter className="bg-(--bg-sidebar)">
        <FooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}

const HeaderContent = () => {
  return (
    <header className="text-(--text-primary) flex justify-start items-center gap-4 mb-2 pl-2.5 pt-4">
      <div className="bg-(--accent-blue) w-12 h-10 rounded-sm flex justify-center items-center">
        <FontAwesomeIcon icon={faDivide} width="50%" height="50%" fill="#fff" />
      </div>

      <h1 className="text-3xl">SplitSmart</h1>
    </header>
  );
};

const Group = () => {
  return (
    <SidebarGroup className="pl-5">
      <SidebarGroupLabel>GROUPS</SidebarGroupLabel>
      <SidebarGroupContent className="pl-3 pb-3">
        <div className="flex items-center justify-between hover:bg-(--accent-blue)/25 p-3 py-1.5 rounded-md cursor-pointer mb-1">
          <div className="flex gap-2 items-center">
            <div className="h-7 w-1.25 bg-(--accent-blue) rounded-lg"></div>
            <h2>Trip to Japan</h2>
          </div>
          <p className="text-(--accent-green)">+$216.74</p>
        </div>

        <div className="flex items-center justify-between hover:bg-(--accent-blue)/25 p-3 py-1.5 rounded-md cursor-pointer mb-1">
          <div className="flex gap-2 items-center">
            <div className="h-7 w-1.25 bg-(--accent-blue) rounded-lg"></div>
            <h2>Trip to Japan</h2>
          </div>
          <p className="text-(--accent-green)">+$216.74</p>
        </div>

        <div className="flex items-center justify-between hover:bg-(--accent-blue)/25 p-3 py-1.5 rounded-md cursor-pointer mb-1">
          <div className="flex gap-2 items-center">
            <div className="h-7 w-1.25 bg-(--accent-blue) rounded-lg"></div>
            <h2>Trip to Japan</h2>
          </div>
          <p className="text-(--accent-green)">+$216.74</p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const FooterContent = () => {
  return (
    <footer className="border-t-2 p-5">
      <div className="flex items-center mb-2">
        <Plus />
        <Button variant="ghost">New Group</Button>
      </div>

      <div className="flex justify-between">
        <p>Themes</p>
        <div className="flex gap-3">
          <Monitor />
          <Moon />
          <Sun />
        </div>
      </div>
    </footer>
  );
};
