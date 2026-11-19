import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export class ExpenseRepository {
  constructor(private readonly expenses: Prisma.TransactionClient["expense"]) {}

  create(data: Prisma.ExpenseUncheckedCreateInput) {
    return this.expenses.create({ data });
  }

  findWithSplits(id: string) {
    return this.expenses.findUniqueOrThrow({
      where: { id },
      include: { splits: true },
    });
  }
}
