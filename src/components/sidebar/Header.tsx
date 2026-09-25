"use client";

import { useSidebar } from "@/components/ui/sidebar"; // Adjust path to your sidebar component
import { Logo } from "@/components/shared";

export default () => {
  const { open } = useSidebar();

  return (
    <header className="mb-3 pt-4 transition-all duration-300 ease-in-out">
      <Logo open={open} />
    </header>
  );
};


