import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Groups from "./Groups";
import ActionBtn from "./ActionBtn";

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-r-(--text-dim)/50"
    >
      <SidebarHeader className="bg-(--bg-sidebar)">
        <Header />
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
