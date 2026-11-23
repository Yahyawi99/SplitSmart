import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/currency";

interface BalanceCardProps {
  balanceCents?: number;
  amountPaidCents?: number;
  shareCents?: number;
  currency?: string;
  description?: string;
  loading?: boolean;
}

export function BalanceCard({
  balanceCents = 0,
  amountPaidCents = 0,
  shareCents = 0,
  currency = "USD",
  description = "others owe you across this group",
  loading = false,
}: BalanceCardProps) {
  if (loading) {
    return (
      <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--accent-green)/10 text-(--accent-green)">
              <Skeleton className="h-5 w-5" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-64 mt-1" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-(--text-dim)/25 pt-4">
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--accent-green)/10 text-(--accent-green)">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-(--text-secondary)">
              You are owed
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-(--accent-green)">
              {formatCurrency(balanceCents, currency)}
            </h2>
            <p className="mt-1 text-xs text-(--text-dim)">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-(--text-dim)/25 pt-4">
          <div>
            <p className="text-xs text-(--text-secondary)">You paid</p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(amountPaidCents, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-(--text-secondary)">Your share</p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(shareCents, currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
