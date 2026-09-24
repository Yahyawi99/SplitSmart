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
import { ArrowDownLeft, ShieldCheck } from "lucide-react";

interface SuggestedSettlement {
  personName: string;
  personInitials: string;
  amount: string;
  onRecord?: () => void;
}

export function SuggestedSettlementsCard({
  personName = "Jordan Park",
  personInitials = "JP",
  amount = "$216.47",
  onRecord,
}: Partial<SuggestedSettlement>) {
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
