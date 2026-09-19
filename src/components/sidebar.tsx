import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { faDivide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function AppSidebar() {
  return (
    <Sidebar className="pl-2.5 pt-4">
      <SidebarHeader className=" bg-(--bg-sidebar)">
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className=" bg-(--bg-sidebar)">
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className=" bg-(--bg-sidebar)" />
    </Sidebar>
  );
}

const HeaderContent = () => {
  return (
    <header className="text-(--text-primary) flex justify-start items-center gap-4">
      <div className="bg-(--accent-blue) w-12 h-10 rounded-sm flex justify-center items-center">
        <FontAwesomeIcon icon={faDivide} width="50%" height="50%" fill="#fff" />
      </div>

      <h1 className="text-3xl">SplitSmart</h1>
    </header>
  );
};
