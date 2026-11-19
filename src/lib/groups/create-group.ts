import "server-only";
import { GroupRole } from "@/generated/prisma/enums";
import type { PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/lib/business-transaction";
import type { CreateGroupInput } from "@/types/group";

export async function createGroup(
  input: CreateGroupInput,
  client?: PrismaClient,
) {
  const name = input.name.trim();
  const currency = input.currency.trim();

  if (!input.creatorId.trim()) {
    throw new Error("A group creator is required");
  }
  if (!name) {
    throw new Error("A group name is required");
  }
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error("Group currency must be an uppercase three-letter code");
  }

  return withSerializableTransaction(async (transaction) => {
    const creator = await transaction.user.findUnique({
      where: { id: input.creatorId },
      select: { id: true },
    });

    if (!creator) {
      throw new Error("Group creator was not found");
    }

    return transaction.group.create({
      data: {
        name,
        description: input.description?.trim() || null,
        currency,
        createdById: input.creatorId,
        members: {
          create: {
            userId: input.creatorId,
            role: GroupRole.OWNER,
            active: true,
          },
        },
      },
      include: { members: true },
    });
  }, client);
}
