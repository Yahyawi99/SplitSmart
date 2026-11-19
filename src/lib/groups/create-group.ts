import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { withSerializableTransaction } from "@/database/transaction";
import { createRepositories } from "@/repositories";
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
    const repositories = createRepositories(transaction);
    const creator = await repositories.users.findById(input.creatorId);
    if (!creator) {
      throw new Error("Group creator was not found");
    }

    return repositories.groups.createWithOwner({
      creatorId: input.creatorId,
      name,
      description: input.description?.trim() || null,
      currency,
    });
  }, client);
}
