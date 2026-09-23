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
    <Card className="border-zinc-800 bg-zinc-900/60 text-zinc-100 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-zinc-200">
          Suggested settlements
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          A minimal set of payments to square everyone up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-amber-500/30 bg-amber-500/20">
              <AvatarFallback className="bg-amber-500/20 text-xs font-semibold text-amber-500">
                {personInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-zinc-200">
                <span className="font-semibold text-zinc-100">
                  {personName}
                </span>{" "}
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
            className="h-8 border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white"
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
