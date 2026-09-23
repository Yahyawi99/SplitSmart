"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserGroup } from "lucide-react";

export default () => {
  const { open } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "h-auto opacity-100 mb-2" : " h-0 opacity-0"
        }`}
      >
        GROUPS
      </SidebarGroupLabel>
      {/* active state : bg-(--accent-blue)/25 and disable the cursor  */}
      <SidebarGroupContent >
        <div
          className={`flex items-center hover:bg-(--accent-btn)/25 rounded-md cursor-pointer mb-1 bg-(--accent-btn)/25 p-3.5 transition-all duration-300 ease-in-out ${
            open ? "justify-between" : "mt-10 p-0! w-[95%] h-10 justify-center"
          }`}
        >
          <div className="flex gap-2 items-center">
            <UserGroup className="w-4 h-4" />
            <h2
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                !open && "hidden"
              }`}
            >
              Trip to Japan
            </h2>
          </div>

          <p
            className={`text-(--accent-green) whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              open ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            +$216.74
          </p>
        </div>

        <div
          className={`flex items-center hover:bg-(--accent-btn)/25 rounded-md cursor-pointer mb-1 bg-(--accent-btn)/25 p-3.5 transition-all duration-300 ease-in-out ${
            open ? "justify-between" : " p-0! w-[95%] h-10 justify-center"
          }`}
        >
          <div className="flex gap-2 items-center">
            <UserGroup className="w-4 h-4" />
            <h2
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                !open && "hidden"
              }`}
            >
              Trip to Japan
            </h2>
          </div>

          <p
            className={`text-(--accent-green) whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              open ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            +$216.74
          </p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
