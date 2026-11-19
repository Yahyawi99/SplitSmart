import "server-only";
import { GroupRole } from "@/generated/prisma/enums";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/lib/business-transaction";
import type { AddGroupMemberInput, SetGroupMemberActiveInput } from "@/types/group";

async function requireActiveOwner(
  transaction: Prisma.TransactionClient,
  groupId: string,
  actorUserId: string,
): Promise<void> {
  const owner = await transaction.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: actorUserId } },
    select: { active: true, role: true },
  });
  if (!owner?.active || owner.role !== GroupRole.OWNER) {
    throw new Error("An active group owner is required");
  }
}

export async function addGroupMember(
  input: AddGroupMemberInput,
  client?: PrismaClient,
) {
  return withSerializableTransaction(async (transaction) => {
    await requireActiveOwner(transaction, input.groupId, input.actorUserId);

    const user = await transaction.user.findUnique({
      where: { id: input.userId },
      select: { id: true },
    });
    if (!user) {
      throw new Error("Group member user was not found");
    }

    return transaction.groupMember.create({
      data: { groupId: input.groupId, userId: input.userId },
    });
  }, client);
}

export async function setGroupMemberActive(
  input: SetGroupMemberActiveInput,
  client?: PrismaClient,
) {
  return withSerializableTransaction(async (transaction) => {
    await requireActiveOwner(transaction, input.groupId, input.actorUserId);

    const membership = await transaction.groupMember.findUnique({
      where: { groupId_userId: { groupId: input.groupId, userId: input.userId } },
    });
    if (!membership) {
      throw new Error("Group membership was not found");
    }
    if (membership.active === input.active) {
      return membership;
    }

    if (!input.active) {
      const activeMembers = await transaction.groupMember.count({
        where: { groupId: input.groupId, active: true },
      });
      if (activeMembers <= 1) {
        throw new Error("A group must have at least one active member");
      }
    }

    return transaction.groupMember.update({
      where: { groupId_userId: { groupId: input.groupId, userId: input.userId } },
      data: { active: input.active },
    });
  }, client);
}