import "server-only";
import { GroupRole } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

export class GroupRepository {
  constructor(private readonly groups: Prisma.TransactionClient["group"]) {}

  findById(id: string) {
    return this.groups.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findCurrency(id: string) {
    return this.groups.findUnique({
      where: { id },
      select: { currency: true },
    });
  }

  createWithOwner(input: {
    creatorId: string;
    name: string;
    description: string | null;
    currency: string;
  }) {
    return this.groups.create({
      data: {
        name: input.name,
        description: input.description,
        currency: input.currency,
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
  }
}
