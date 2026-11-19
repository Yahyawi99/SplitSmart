import "server-only";
import { SplitType } from "@/generated/prisma/enums";
import type { PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/lib/business-transaction";
import {
  calculateSplits,
  convertToHomeCurrencyCents,
  isUnitExchangeRate,
} from "./split-calculator";

type SplitParticipants =
  | {
      splitType: typeof SplitType.EQUAL;
      participants: readonly { userId: string }[];
    }
  | {
      splitType: typeof SplitType.EXACT;
      participants: readonly { userId: string; owedCents: number }[];
    }
  | {
      splitType: typeof SplitType.PERCENTAGE;
      participants: readonly { userId: string; percentage: string }[];
    }
  | {
      splitType: typeof SplitType.SHARES;
      participants: readonly { userId: string; shares: number }[];
    };

export type CreateExpenseInput = SplitParticipants & {
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

function calculateExpenseSplits(input: CreateExpenseInput, totalCents: number) {
  switch (input.splitType) {
    case SplitType.EQUAL:
      return calculateSplits({
        splitType: input.splitType,
        totalCents,
        participants: input.participants,
      });
    case SplitType.EXACT:
      return calculateSplits({
        splitType: input.splitType,
        totalCents,
        participants: input.participants,
      });
    case SplitType.PERCENTAGE:
      return calculateSplits({
        splitType: input.splitType,
        totalCents,
        participants: input.participants,
      });
    case SplitType.SHARES:
      return calculateSplits({
        splitType: input.splitType,
        totalCents,
        participants: input.participants,
      });
  }
}

export async function createExpense(
  input: CreateExpenseInput,
  client?: PrismaClient,
) {
  const description = input.description.trim();
  const category = input.category.trim();
  const currency = input.currency.trim();

  if (!input.groupId.trim() || !input.actorUserId.trim() || !input.payerId.trim()) {
    throw new Error("Group, actor, and payer are required");
  }
  if (!description || !category) {
    throw new Error("Expense description and category are required");
  }
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error("Expense currency must be an uppercase three-letter code");
  }
  if (!(input.date instanceof Date) || Number.isNaN(input.date.getTime())) {
    throw new Error("Expense date must be a valid date");
  }

  const homeTotalCents = convertToHomeCurrencyCents(
    input.amountCents,
    input.exchangeRate,
  );
  const splits = calculateExpenseSplits(input, homeTotalCents);

  return withSerializableTransaction(async (transaction) => {
    const group = await transaction.group.findUnique({
      where: { id: input.groupId },
      select: { currency: true },
    });
    if (!group) {
      throw new Error("Expense group was not found");
    }
    if (currency === group.currency && !isUnitExchangeRate(input.exchangeRate)) {
      throw new Error("Exchange rate must be 1 when expense currency matches group currency");
    }

    const requiredUserIds = new Set([
      input.actorUserId,
      input.payerId,
      ...splits.map(({ userId }) => userId),
    ]);
    const activeMemberships = await transaction.groupMember.findMany({
      where: {
        groupId: input.groupId,
        userId: { in: [...requiredUserIds] },
        active: true,
      },
      select: { userId: true },
    });
    const activeUserIds = new Set(activeMemberships.map(({ userId }) => userId));

    if (!activeUserIds.has(input.actorUserId)) {
      throw new Error("Expense actor must be an active group member");
    }
    if (!activeUserIds.has(input.payerId)) {
      throw new Error("Expense payer must be an active group member");
    }
    if (splits.some(({ userId }) => !activeUserIds.has(userId))) {
      throw new Error("Every split participant must be an active group member");
    }

    const expense = await transaction.expense.create({
      data: {
        groupId: input.groupId,
        payerId: input.payerId,
        description,
        amountCents: input.amountCents,
        currency,
        exchangeRate: input.exchangeRate,
        category,
        splitType: input.splitType,
        date: input.date,
      },
    });

    await transaction.expenseSplit.createMany({
      data: splits.map((split) => ({ ...split, expenseId: expense.id })),
    });

    return transaction.expense.findUniqueOrThrow({
      where: { id: expense.id },
      include: { splits: true },
    });
  }, client);
}