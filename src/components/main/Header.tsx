import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HandCoins, Plus, Settings } from "lucide-react";

interface Member {
  initials: string;
  color: string; // tailwind bg class, e.g. "bg-violet-500"
}

interface TripHeaderProps {
  title: string;
  description: string;
  totalSpent: number;
  expenseCount: number;
  members: Member[];
  onSettleUp?: () => void;
  onAddExpense?: () => void;
  onSettings?: () => void;
}

const defaultMembers: Member[] = [
  { initials: "AC", color: "bg-indigo-500" },
  { initials: "JP", color: "bg-fuchsia-500" },
  { initials: "SR", color: "bg-rose-500" },
  { initials: "TK", color: "bg-teal-500" },
];

export default function TripHeader({
  title = "Trip to Japan",
  description = "Two weeks in Tokyo, Kyoto, and Osaka. Cherry blossom season 2024.",
  totalSpent = 2751.24,
  expenseCount = 13,
  members = defaultMembers,
  onSettleUp,
  onAddExpense,
  onSettings,
}: Partial<TripHeaderProps>) {
  return (
    <div className="w-full bg-[#0a0d14] px-6 py-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            onClick={onSettleUp}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
          >
            <HandCoins className="h-4 w-4" />
            Settle up
          </Button>
          <Button
            onClick={onAddExpense}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add expense
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onSettings}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5 text-slate-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h.01" />
          </svg>
          <span className="font-semibold text-white">
            ${totalSpent.toFixed(2)}
          </span>
          <span>total spent</span>
        </div>

        <div className="text-slate-300">
          <span className="font-semibold text-white">{expenseCount}</span>{" "}
          expenses
        </div>

        <div className="flex items-center">
          <div className="flex -space-x-2">
            {members.map((member, i) => (
              <Avatar key={i} className="h-7 w-7 border-2 border-[#0a0d14]">
                <AvatarFallback
                  className={`${member.color} text-[10px] font-semibold text-white`}
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-3 text-slate-300">{members.length} members</span>
        </div>
      </div>
    </div>
  );
}
