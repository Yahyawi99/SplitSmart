import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export class SettlementRepository {
  constructor(
    private readonly settlements: Prisma.TransactionClient["settlement"],
  ) {}

  create(data: Prisma.SettlementUncheckedCreateInput) {
    return this.settlements.create({ data });
  }
}
