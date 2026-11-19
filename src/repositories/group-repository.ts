import "server-only";
import { GroupRole } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

const GROUPS_PAGE_SIZE = 10;

export class GroupRepository {
  constructor(private readonly groups: Prisma.TransactionClient["group"]) {}

  async findForUser(userId: string, page = 1) {
    const where = {
      members: { some: { userId, active: true } },
    };
    const [groups, total] = await Promise.all([
      this.groups.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * GROUPS_PAGE_SIZE,
        take: GROUPS_PAGE_SIZE,
        select: { id: true, name: true, currency: true },
      }),
      this.groups.count({ where }),
    ]);

    return {
      groups,
      hasMore: page * GROUPS_PAGE_SIZE < total,
    };
  }

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
