export type ActivityUser = {
  id: string;
  name: string | null;
  initials: string;
};

export type ExpenseActivityItem = {
  id: string;
  type: "expense";
  title: string;
  user: ActivityUser;
  date: string;
  amountCents: number;
  currency: string;
  category?: string | null;
  badge?: string | null;
};

export type SettlementActivityItem = {
  id: string;
  type: "settlement";
  title: string;
  user: ActivityUser | null;
  date: string;
  amountCents: number;
  currency: string;
};

export type ActivityItem = ExpenseActivityItem | SettlementActivityItem;
