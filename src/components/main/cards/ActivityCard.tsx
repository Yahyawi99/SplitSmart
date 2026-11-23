import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SlidersHorizontal,
  Plus,
  Utensils,
  Landmark,
  ShoppingCart,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { getInitials } from "@/utils/initials";
import { getAvatarColor } from "@/utils/avatar-color";
import type { ActivityItem } from "@/types/activity";

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  "Convenience store runs (accumulated)": ShoppingCart,
  paid: Handshake,
  entry: Landmark,
  dinner: Utensils,
  "food tour": Utensils,
  default: ShoppingCart,
};

function resolveIcon(title: string): React.ElementType {
  for (const [keyword, Icon] of Object.entries(ACTIVITY_ICONS)) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      return Icon;
    }
  }
  return ACTIVITY_ICONS.default;
}

interface ActivityCardProps {
  items: ActivityItem[];
  expenseCount: number;
  settlementCount: number;
  loading?: boolean;
}

export function ActivityCard({
  items = [],
  expenseCount = 0,
  settlementCount = 0,
  loading = false,
}: Partial<ActivityCardProps>) {
  if (loading) {
    return (
      <Card className="w-full bg-(--bg-sidebar) border border-(--text-dim)/50 text-primary ring-0 rounded-xl ">
        <CardHeader className="border-b border-(--text-dim)/25 pb-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Button
                variant="outline"
                size="sm"
                className="bg-(--bg-active) border-(--text-dim)/50  text-(--text-secondary) gap-2 h-9 px-4 cursor-pointer"
                disabled
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold text-primary">
                  Activity
                </CardTitle>
                <p className="text-sm text-(--text-dim) mt-0.5">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4 mt-1" />
                  <Skeleton className="h-4 w-1/3 mt-1" />
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-(--accent-btn) hover:bg-(--accent-btn-hover)/75 text-primary gap-2 h-10 px-5 rounded-lg text-sm font-semibold cursor-pointer"
              disabled
            >
              <Plus className="h-4 w-4" />
              New expense
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-(--bg-active)">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-(--text-dim)/50 bg-(--bg-surface)">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-6 w-32" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-(--text-muted) hover:bg-transparent hover:text-(--text-primary)"
                    disabled
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {expenseCount} expenses <span className="mx-1.5">•</span> {settlementCount} settlements
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
          {items.map((item) => {
            const Icon = resolveIcon(item.title);
            const isSettlement = item.type === "settlement";
            const user = item.user;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 gap-4 hover:bg-(--accent-btn)/15 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-(--text-dim)/50 bg-(--bg-surface) ${
                      isSettlement ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="truncate text-base font-medium text-(--text-primary)">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                      {user && (
                        <>
                          <Avatar className={`h-6 w-6 ${getAvatarColor(user.id)}`}>
                            <AvatarFallback className="text-[11px] font-bold text-white">
                              {user.initials || getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-(--text-primary)">
                            {user.name}
                          </span>
                          <span className="text-(--text-dim)">•</span>
                        </>
                      )}

                      {isSettlement && (
                        <Badge
                          variant="secondary"
                          className="rounded-md border border-(--accent-green)/30 bg-(--accent-green)/10 px-2 py-0.5 text-xs font-medium text-(--accent-green)"
                        >
                          Settlement
                        </Badge>
                      )}

                      {item.type === "expense" && item.badge && (
                        <Badge
                          variant="secondary"
                          className="rounded-md border border-(--text-dim)/50 bg-(--bg-active) px-2 py-0.5 text-xs font-medium text-(--text-secondary)"
                        >
                          {item.badge}
                        </Badge>
                      )}

                      <span className="text-(--text-muted)">{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xl font-semibold tracking-tight ${isSettlement ? "text-(--accent-green)" : "text-(--text-primary)"}`}
                  >
                    {formatCurrency(item.amountCents, item.currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-(--text-muted) hover:bg-transparent hover:text-(--text-primary)"
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
