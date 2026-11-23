import { getInitials } from "@/utils/initials";
import type { ActivityItem } from "@/types/activity";
import type { UserBalanceSummary } from "@/types/group";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function mapGroupToActivityItems(
  expenses: readonly {
    id: string;
    description: string;
    amountCents: number;
    currency: string;
    category: string;
    splitType: string;
    date: Date;
    payerId: string;
    payer: { name: string | null };
    splits: readonly { userId: string; owedCents: number }[];
  }[],
  settlements: readonly {
    id: string;
    amountCents: number;
    date: Date;
    fromUserId: string;
    fromUserName: string | null;
    toUserId: string;
    toUserName: string | null;
    note: string | null;
  }[],
  groupCurrency: string,
): ActivityItem[] {
  const expenseItems: ActivityItem[] = expenses.map((e) => ({
    id: e.id,
    type: "expense",
    title: e.description,
    user: {
      id: e.payerId,
      name: e.payer.name,
      initials: getInitials(e.payer.name),
    },
    date: formatDate(e.date),
    amountCents: e.amountCents,
    currency: e.currency,
    category: e.category,
    badge: e.splitType,
  }));

  const settlementItems: ActivityItem[] = settlements.map((s) => ({
    id: s.id,
    type: "settlement",
    title: `${s.fromUserName ?? "Unknown"} paid ${s.toUserName ?? "Unknown"}`,
    user: {
      id: s.fromUserId,
      name: s.fromUserName,
      initials: getInitials(s.fromUserName),
    },
    date: formatDate(s.date),
    amountCents: s.amountCents,
    currency: groupCurrency,
  }));

  return [...expenseItems, ...settlementItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function calculateUserBalance(
  expenses: readonly {
    id: string;
    amountCents: number;
    payerId: string;
    splits: readonly { userId: string; owedCents: number }[];
  }[],
  settlements: readonly {
    id: string;
    amountCents: number;
    fromUserId: string;
    toUserId: string;
  }[],
  userId: string,
): UserBalanceSummary {
  const totalPaidCents = expenses
    .filter((e) => e.payerId === userId)
    .reduce((sum, e) => sum + e.amountCents, 0);

  const totalOwedCents = expenses.reduce(
    (sum, e) =>
      sum +
      e.splits
        .filter((s) => s.userId === userId)
        .reduce((s2, s) => s2 + s.owedCents, 0),
    0,
  );

  const totalReceivedCents = settlements
    .filter((s) => s.toUserId === userId)
    .reduce((sum, s) => sum + s.amountCents, 0);

  const totalSentCents = settlements
    .filter((s) => s.fromUserId === userId)
    .reduce((sum, s) => sum + s.amountCents, 0);

  const balanceCents =
    totalPaidCents - totalOwedCents + totalReceivedCents - totalSentCents;

  return {
    userId,
    name: null,
    balanceCents,
    amountPaidCents: totalPaidCents,
    shareCents: totalOwedCents,
  };
}