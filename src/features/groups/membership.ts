import "server-only";
import { GroupRole } from "@/generated/prisma/enums";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/database/transaction";
import { createRepositories } from "@/repositories";
import type {
  AddGroupMemberInput,
  SetGroupMemberActiveInput,
} from "@/types/group";

async function requireActiveOwner(
  memberships: ReturnType<typeof createRepositories>["groupMembers"],
  groupId: string,
  actorUserId: string,
): Promise<void> {
  const owner = await memberships.findActiveOwner(groupId, actorUserId);
  if (!owner?.active || owner.role !== GroupRole.OWNER) {
    throw new Error("An active group owner is required");
  }
}

export async function addGroupMember(
  input: AddGroupMemberInput,
  client?: PrismaClient,
) {
  return withSerializableTransaction(async (transaction) => {
    const repositories = createRepositories(transaction);
    await requireActiveOwner(
      repositories.groupMembers,
      input.groupId,
      input.actorUserId,
    );

    const user = await repositories.users.findById(input.userId);
    if (!user) {
      throw new Error("Group member user was not found");
    }

    return repositories.groupMembers.create(input.groupId, input.userId);
  }, client);
}

export async function setGroupMemberActive(
  input: SetGroupMemberActiveInput,
  client?: PrismaClient,
) {
  return withSerializableTransaction(async (transaction) => {
    const repositories = createRepositories(transaction);
    await requireActiveOwner(
      repositories.groupMembers,
      input.groupId,
      input.actorUserId,
    );

    const membership = await repositories.groupMembers.findByGroupAndUser(
      input.groupId,
      input.userId,
    );
    if (!membership) {
      throw new Error("Group membership was not found");
    }
    if (membership.active === input.active) {
      return membership;
    }

    if (!input.active) {
      const activeMembers = await repositories.groupMembers.countActive(
        input.groupId,
      );
      if (activeMembers <= 1) {
        throw new Error("A group must have at least one active member");
      }
    }

    return repositories.groupMembers.setActive(
      input.groupId,
      input.userId,
      input.active,
    );
  }, client);
}
