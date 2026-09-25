import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  SlidersHorizontal,
  Plus,
  Utensils,
  Landmark,
  ShoppingCart,
  Handshake,
  ChevronRight,
} from "lucide-react";

const activityItems = [
  {
    icon: ShoppingCart,
    iconColor: "text-purple-400",
    title: "Convenience store runs (accumulated)",
    user: { initials: "SR", name: "Sam Rivera", color: "bg-pink-500" },
    date: "Mar 27, 2024",
    amount: "¥8,340",
    type: "expense",
  },
  {
    icon: Handshake,
    iconColor: "text-emerald-400",
    title: "Sam Rivera paid Taylor Kim",
    user: { initials: "SR", name: "Sam Rivera", color: "bg-pink-500" },
    date: "Mar 26, 2024",
    amount: "¥8,500",
    type: "settlement",
  },
  {
    icon: Landmark,
    iconColor: "text-amber-400",
    title: "Osaka Castle entry",
    user: { initials: "JP", name: "Jordan Park", color: "bg-amber-500" },
    date: "Mar 26, 2024",
    amount: "¥2,400",
    type: "expense",
  },
  {
    icon: Utensils,
    iconColor: "text-orange-400",
    title: "Izakaya dinner in Dotonbori",
    user: { initials: "AC", name: "Alex Chen", color: "bg-indigo-500" },
    date: "Mar 25, 2024",
    amount: "¥42,600",
    type: "expense",
    badge: "Shares",
  },
  {
    icon: Utensils,
    iconColor: "text-orange-400",
    title: "Osaka street food tour",
    user: { initials: "TK", name: "Taylor Kim", color: "bg-teal-500" },
    date: "Mar 25, 2024",
    amount: "¥28,000",
    type: "expense",
  },
  {
    icon: Handshake,
    iconColor: "text-emerald-400",
    title: "Jordan Park paid Alex Chen",
    user: null, // Note: In the image, user details are not shown for the last settlement
    date: "Mar 24, 2024",
    amount: "$150.00",
    type: "settlement",
  },
];

export function ActivityCard() {
  return (
    <Card className="w-full bg-(--bg-sidebar) border border-(--text-dim)/50 text-primary ring-0 rounded-xl ">
      <CardHeader className="border-b border-(--text-dim)/25 pb-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Button
              variant="outline"
              size="sm"
              className="bg-(--bg-active) border-(--text-dim)/50  text-(--text-secondary) gap-2 h-9 px-4 cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                Activity
              </CardTitle>
              <p className="text-sm text-(--text-dim) mt-0.5">
                13 expenses <span className="mx-1.5">•</span> 2 settlements
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-(--accent-btn) hover:bg-(--accent-btn-hover)/75 text-primary gap-2 h-10 px-5 rounded-lg text-sm font-semibold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New expense
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-(--bg-active)">
          {activityItems.map((item, index) => {
            const Icon = item.icon;
            const isSettlement = item.type === "settlement";

            return (
              <div
                key={index}
                className="flex items-center justify-between p-5 gap-4 hover:bg-(--accent-btn)/15 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a1d21] border border-zinc-800/80 ${item.iconColor}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-base font-medium text-zinc-100 truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                      {item.user && (
                        <>
                          <Avatar className={`h-6 w-6 ${item.user.color}`}>
                            <AvatarFallback className="text-[11px] font-bold text-white">
                              {item.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-zinc-300">
                            {item.user.name}
                          </span>
                          <span className="text-zinc-600">•</span>
                        </>
                      )}

                      {isSettlement && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 text-xs rounded-md font-medium"
                        >
                          Settlement
                        </Badge>
                      )}

                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 text-xs rounded-md font-medium"
                        >
                          {item.badge}
                        </Badge>
                      )}

                      <span className="text-zinc-500">{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xl font-semibold tracking-tight ${isSettlement ? "text-emerald-400" : "text-zinc-100"}`}
                  >
                    {item.amount}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-white hover:bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
