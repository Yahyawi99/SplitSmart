"use client"
import { useState } from "react";
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
import { CreateGroupDialog } from "./CreateGroupDialog";

export function AppSidebar() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

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
        <ActionBtn onNewGroup={() => setCreateGroupOpen(true)} />
      </SidebarContent>
      <SidebarFooter className="bg-(--bg-sidebar)">
        <Footer />
      </SidebarFooter>
      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
    </Sidebar>
  );
}
