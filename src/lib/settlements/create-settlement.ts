import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/lib/business-transaction";

const MAX_CENTS = 2_147_483_647;

export type CreateSettlementInput = {
  groupId: string;
  actorUserId: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  date: Date;
  note?: string | null;
};

export async function createSettlement(
  input: CreateSettlementInput,
  client?: PrismaClient,
) {
  if (!input.groupId.trim() || !input.actorUserId.trim()) {
    throw new Error("Settlement group and actor are required");
  }
  if (!input.fromUserId.trim() || !input.toUserId.trim()) {
    throw new Error("Settlement sender and receiver are required");
  }
  if (input.fromUserId === input.toUserId) {
    throw new Error("Settlement sender and receiver must be different");
  }
  if (
    !Number.isSafeInteger(input.amountCents) ||
    input.amountCents <= 0 ||
    input.amountCents > MAX_CENTS
  ) {
    throw new Error("Settlement amount must be a positive 32-bit integer");
  }
  if (!(input.date instanceof Date) || Number.isNaN(input.date.getTime())) {
    throw new Error("Settlement date must be a valid date");
  }

  return withSerializableTransaction(async (transaction) => {
    const group = await transaction.group.findUnique({
      where: { id: input.groupId },
      select: { id: true },
    });
    if (!group) {
      throw new Error("Settlement group was not found");
    }

    const requiredUserIds = new Set([
      input.actorUserId,
      input.fromUserId,
      input.toUserId,
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
      throw new Error("Settlement actor must be an active group member");
    }
    if (!activeUserIds.has(input.fromUserId) || !activeUserIds.has(input.toUserId)) {
      throw new Error("Settlement sender and receiver must be active group members");
    }

    return transaction.settlement.create({
      data: {
        groupId: input.groupId,
        fromUserId: input.fromUserId,
        toUserId: input.toUserId,
        amountCents: input.amountCents,
        date: input.date,
        note: input.note?.trim() || null,
      },
    });
  }, client);
}