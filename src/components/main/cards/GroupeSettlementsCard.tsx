import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GroupSettlementsCardProps {
  fromUser: { name: string; initials: string };
  toUser: { name: string; initials: string };
  amount: string;
  onSettle?: () => void;
}

export function GroupSettlementsCard({
  fromUser = { name: "Sam Rivera", initials: "SR" },
  toUser = { name: "Taylor Kim", initials: "TK" },
  amount = "$315.10",
  onSettle,
}: Partial<GroupSettlementsCardProps>) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60 text-zinc-100 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Others in this group
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-pink-500/20 text-[10px] font-bold text-pink-400">
                {fromUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-zinc-200">{fromUser.name}</span>
            <span className="text-zinc-500">➔</span>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-teal-500/20 text-[10px] font-bold text-teal-400">
                {toUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-zinc-200">{toUser.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-300">{amount}</span>
            <Button
              onClick={onSettle}
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-zinc-400 hover:text-zinc-100"
            >
              Settle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
