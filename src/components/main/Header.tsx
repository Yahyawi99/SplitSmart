import { Button } from "@/components/ui/button";
import { HandCoins, Plus, Settings } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

interface HeaderProps {
  onSettleUp?: () => void;
  onAddExpense?: () => void;
  onSettings?: () => void;
}

export function Header({
  onSettleUp,
  onAddExpense,
  onSettings,
}: Partial<HeaderProps>) {
  return (
    <header className="w-full bg-(--bg-sidebar) text-(--text-primary) sticky top-0 z-20">
      <div className="flex justify-between pt-3 px-2 pb-2 border-b border-b-(--text-dim)/50 mb-5">
        <SidebarTrigger />

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            onClick={onSettleUp}
            className="cursor-pointer border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
          >
            <HandCoins className="h-4 w-4" />
            Settle up
          </Button>
          <Button
            onClick={onAddExpense}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add expense
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onSettings}
            className="cursor-pointer border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
