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
    <Sidebar>
      <SidebarHeader className=" bg-(--bg-base)" />
      <SidebarContent className=" bg-(--bg-base)">
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className=" bg-(--bg-base)" />
    </Sidebar>
  );
}

const HeaderContent = () => {
  return (
    <header>
      <div>
        <FontAwesomeIcon icon={faDivide} />
      </div>

      <h1>SplitSmart</h1>
    </header>
  );
};
