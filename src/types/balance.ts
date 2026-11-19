export type BalanceExpense = {
  payerId: string;
  amountCents: number;
  exchangeRate: string;
  splits: readonly { userId: string; owedCents: number }[];
};