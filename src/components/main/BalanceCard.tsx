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
    <Card className="border-zinc-800 bg-zinc-900/60 text-zinc-100 backdrop-blur">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">You are owed</p>
            <h2 className="text-3xl font-bold tracking-tight text-emerald-400">
              {amountOwed}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
          <div>
            <p className="text-xs text-zinc-400">You paid</p>
            <p className="text-sm font-semibold text-zinc-200">{amountPaid}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400">Your share</p>
            <p className="text-sm font-semibold text-zinc-200">{yourShare}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
