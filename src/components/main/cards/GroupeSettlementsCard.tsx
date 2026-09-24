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
    <Card className="w-full border border-(--text-dim)/50 bg-(--bg-sidebar) text-primary ring-0 rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold tracking-wider text-(--text-primary)">
          Others in this group
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-(--text-primary)">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-(--accent-btn)/25 text-[10px] font-bold text-(--accent-btn)">
                {fromUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-primary">{fromUser.name}</span>
            <span className="text-(--text-dim)">➔</span>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-(--accent-green)/10 text-[10px] font-bold text-(--accent-green)">
                {toUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-primary">{toUser.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-(--text-secondary)">
              {amount}
            </span>
            <Button
              onClick={onSettle}
              variant="link"
              size="sm"
              className="h-auto cursor-pointer p-0 text-xs font-medium text-(--text-secondary) hover:text-primary"
            >
              Settle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
