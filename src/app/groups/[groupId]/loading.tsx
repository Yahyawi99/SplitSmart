import { Loader2 } from "lucide-react";
import { Header } from "@/components/main";

export default function GroupLoading() {
  return (
    <div className="w-full relative">
      <Header />
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-3 text-(--accent-btn)" />
        <p className="text-(--text-secondary)">Loading group...</p>
      </div>
    </div>
  );
}