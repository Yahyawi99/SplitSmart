import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export class ExpenseSplitRepository {
  constructor(
    private readonly splits: Prisma.TransactionClient["expenseSplit"],
  ) {}

  createMany(data: Prisma.ExpenseSplitCreateManyInput[]) {
    return this.splits.createMany({ data });
  }
}