import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export class ReceiptRepository {
  constructor(private readonly receipts: Prisma.TransactionClient["receipt"]) {}

  findByExpenseId(expenseId: string) {
    return this.receipts.findUnique({ where: { expenseId } });
  }

  create(data: Prisma.ReceiptUncheckedCreateInput) {
    return this.receipts.create({ data });
  }
}