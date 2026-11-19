import type { SplitCalculationInput } from "@/types/split";

type WithoutTotalCents<T> = T extends unknown ? Omit<T, "totalCents"> : never;

export type ExpenseSplitInput = WithoutTotalCents<SplitCalculationInput>;

export type CreateExpenseInput = ExpenseSplitInput & {
  groupId: string;
  actorUserId: string;
  payerId: string;
  description: string;
  amountCents: number;
  currency: string;
  exchangeRate: string;
  category: string;
  date: Date;
};
