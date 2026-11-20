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
        select: {
          id: true,
          name: true,
          currency: true,
          expenses: {
            select: {
              amountCents: true,
              payerId: true,
              splits: {
                select: {
                  userId: true,
                  owedCents: true,
                },
              },
            },
          },
          settlements: {
            select: {
              amountCents: true,
              fromUserId: true,
              toUserId: true,
            },
          },
        },
      }),
      this.groups.count({ where }),
    ]);

    // Compute the current user's balance per group.
    // balance = (amount paid as payer) - (amount owed in splits)
    //         + (settlements received) - (settlements sent)
    const groupsWithBalance = groups.map((group) => {
      const totalPaid = group.expenses
        .filter((e) => e.payerId === userId)
        .reduce((sum, e) => sum + e.amountCents, 0);

      const totalOwed = group.expenses.reduce(
        (sum, e) =>
          sum +
          e.splits
            .filter((s) => s.userId === userId)
            .reduce((s2, s) => s2 + s.owedCents, 0),
        0,
      );

      const totalReceived = group.settlements
        .filter((s) => s.toUserId === userId)
        .reduce((sum, s) => sum + s.amountCents, 0);

      const totalSent = group.settlements
        .filter((s) => s.fromUserId === userId)
        .reduce((sum, s) => sum + s.amountCents, 0);

      const balanceCents = totalPaid - totalOwed + totalReceived - totalSent;

      return {
        id: group.id,
        name: group.name,
        currency: group.currency,
        balanceCents,
      };
    });

    return {
      groups: groupsWithBalance,
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
