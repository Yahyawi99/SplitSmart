import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft } from "lucide-react";

interface BalanceCardProps {
  amountOwed?: string;
  amountPaid?: string;
  yourShare?: string;
  description?: string;
}

export function BalanceCard({
  amountOwed = "$216.47",
  amountPaid = "$1,123.04",
  yourShare = "$756.58",
  description = "others owe you across this group",
}: BalanceCardProps) {
  return (
    <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--accent-green)/10 text-(--accent-green)">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-(--text-secondary)">
              You are owed
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-(--accent-green)">
              {amountOwed}
            </h2>
            <p className="mt-1 text-xs text-(--text-dim)">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-(--text-dim)/25 pt-4">
          <div>
            <p className="text-xs text-(--text-secondary)">You paid</p>
            <p className="text-sm font-semibold text-primary">{amountPaid}</p>
          </div>
          <div>
            <p className="text-xs text-(--text-secondary)">Your share</p>
            <p className="text-sm font-semibold text-primary">{yourShare}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
