import { Monitor, Moon, Sun } from "lucide-react";

export const themeOptions = [
  { value: "system" as const, label: "System", Icon: Monitor },
  { value: "dark" as const, label: "Dark", Icon: Moon },
  { value: "light" as const, label: "Light", Icon: Sun },
] as const;
