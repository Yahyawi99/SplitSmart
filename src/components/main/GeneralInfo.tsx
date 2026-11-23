"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HandCoins, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { getInitials } from "@/utils/initials";
import { getAvatarColor } from "@/utils/avatar-color";
import { AddExpenseDialog, SettleUpDialog } from "@/components/dialogs";
import { Skeleton } from "@/components/ui/skeleton";
import type { GroupMemberInfo } from "@/types/group";

interface GeneralInfoProps {
  title: string;
  description: string | null;
  totalSpentCents: number;
  expenseCount: number;
  currency: string;
  members: GroupMemberInfo[];
  loading?: boolean;
}

export function GeneralInfo({
  title = "Untitled Group",
  description = null,
  totalSpentCents = 0,
  expenseCount = 0,
  currency = "USD",
  members = [],
  loading = false,
}: Partial<GeneralInfoProps>) {
  if (loading) {
    return (
      <div className="w-full bg-(--bg-base) text-(--text-primary) ">
        <div className="pl-4 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-7 w-7 rounded-full" />
                ))}
              </div>
              <Skeleton className="ml-3 h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);

  return (
    <div className="w-full bg-(--bg-base) text-(--text-primary) ">
      <div className="pl-4 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setSettlementOpen(true)}
              className="cursor-pointer border-(--text-dim)/50 bg-transparent text-(--text-primary) hover:bg-(--bg-active) hover:text-(--text-primary)"
            >
              <HandCoins className="h-4 w-4" />
              Settle up
            </Button>
            <Button
              onClick={() => setExpenseOpen(true)}
              className="cursor-pointer bg-(--accent-btn) hover:bg-(--accent-btn-hover)/75"
            >
              <Plus className="h-4 w-4" />
              Add expense
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-(--text-secondary)">
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
            <span className="font-semibold text-(--text-primary)">
              {formatCurrency(totalSpentCents, currency)}
            </span>
            <span>total spent</span>
          </div>

          <div className="text-(--text-secondary)">
            <span className="font-semibold text-(--text-primary)">
              {expenseCount}
            </span>{" "}
            expenses
          </div>

          <div className="flex items-center">
            <div className="flex -space-x-2">
              {members.map((member) => (
                <Avatar
                  key={member.id}
                  className="h-7 w-7 border-2 border-(--bg-base)"
                >
                  <AvatarFallback
                    className={`${getAvatarColor(member.id)} text-[10px] font-semibold text-white`}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="ml-3 text-(--text-secondary)">
              {members.length} members
            </span>
          </div>
        </div>
      </div>
      <AddExpenseDialog open={expenseOpen} onOpenChange={setExpenseOpen} />
      <SettleUpDialog open={settlementOpen} onOpenChange={setSettlementOpen} />
    </div>
  );
}
