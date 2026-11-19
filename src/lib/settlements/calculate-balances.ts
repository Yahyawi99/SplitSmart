import { convertToHomeCurrencyCents } from "@/lib/expenses/currency";
import type { BalanceExpense } from "@/types/balance";
import type { BalanceSettlement } from "@/types/settlement";

const MAX_CENTS = 2_147_483_647;

function addToBalance(
  balances: Map<string, number>,
  userId: string,
  delta: number,
): void {
  const current = balances.get(userId);
  if (current === undefined) {
    throw new Error(`Financial record references non-member ${userId}`);
  }
  const next = current + delta;
  if (!Number.isSafeInteger(next)) {
    throw new Error("Calculated balance exceeds the safe integer range");
  }
  balances.set(userId, next);
}

export function calculateGroupBalances(
  memberIds: readonly string[],
  expenses: readonly BalanceExpense[],
  settlements: readonly BalanceSettlement[],
): Map<string, number> {
  const balances = new Map<string, number>();
  for (const memberId of memberIds) {
    if (!memberId || balances.has(memberId)) {
      throw new Error("Group members must have unique, non-empty IDs");
    }
    balances.set(memberId, 0);
  }
  if (balances.size === 0) {
    throw new Error("At least one group member is required");
  }

  for (const expense of expenses) {
    const convertedTotal = convertToHomeCurrencyCents(
      expense.amountCents,
      expense.exchangeRate,
    );
    if (expense.splits.length === 0) {
      throw new Error("Every expense must have at least one split");
    }

    const splitUsers = new Set<string>();
    let splitTotal = 0;
    for (const split of expense.splits) {
      if (
        splitUsers.has(split.userId) ||
        !Number.isSafeInteger(split.owedCents) ||
        split.owedCents < 0 ||
        split.owedCents > MAX_CENTS
      ) {
        throw new Error(
          "Expense splits must have unique users and non-negative integer cents",
        );
      }
      splitUsers.add(split.userId);
      splitTotal += split.owedCents;
      addToBalance(balances, split.userId, -split.owedCents);
    }
    if (splitTotal !== convertedTotal) {
      throw new Error("Expense splits must equal the converted expense total");
    }
    addToBalance(balances, expense.payerId, convertedTotal);
  }

  for (const settlement of settlements) {
    if (
      settlement.fromUserId === settlement.toUserId ||
      !Number.isSafeInteger(settlement.amountCents) ||
      settlement.amountCents <= 0 ||
      settlement.amountCents > MAX_CENTS
    ) {
      throw new Error(
        "Settlement must have distinct participants and a positive integer amount",
      );
    }
    addToBalance(balances, settlement.fromUserId, -settlement.amountCents);
    addToBalance(balances, settlement.toUserId, settlement.amountCents);
  }

  const groupTotal = [...balances.values()].reduce(
    (sum, balance) => sum + balance,
    0,
  );
  if (groupTotal !== 0) {
    throw new Error("Group member balances must sum to zero");
  }
  return balances;
}
