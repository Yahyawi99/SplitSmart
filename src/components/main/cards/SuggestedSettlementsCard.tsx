import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ShieldCheck } from "lucide-react";

interface SuggestedSettlement {
  personName: string;
  personInitials: string;
  amount: string;
  onRecord?: () => void;
  loading?: boolean;
}

export function SuggestedSettlementsCard({
  personName = "Jordan Park",
  personInitials = "JP",
  amount = "$216.47",
  onRecord,
  loading = false,
}: Partial<SuggestedSettlement>) {
  if (loading) {
    return (
      <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-primary">
            <Skeleton className="h-4 w-1/3" />
          </CardTitle>
          <CardDescription className="text-xs text-(--text-secondary)">
            <Skeleton className="h-3 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg bg-(--bg-active) p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16 mt-1" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-primary">
          Suggested settlements
        </CardTitle>
        <CardDescription className="text-xs text-(--text-secondary)">
          A minimal set of payments to square everyone up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg bg-(--bg-active) p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-amber-500/30 bg-amber-500/20">
              <AvatarFallback className="bg-amber-500/20 text-xs font-semibold text-amber-500">
                {personInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-primary">
                <span className="font-semibold text-primary">{personName}</span>{" "}
                owes you
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <ArrowDownLeft className="h-3 w-3" />
                <span>+{amount}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onRecord}
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer border-(--text-dim)/50 bg-(--bg-active) text-xs font-medium text-(--text-secondary) hover:bg-(--accent-btn)/25 hover:text-primary"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
