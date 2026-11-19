import "server-only";
import type { Prisma } from "@/generated/prisma/client";

export class GroupMemberRepository {
  constructor(
    private readonly memberships: Prisma.TransactionClient["groupMember"],
  ) {}

  findByGroupAndUser(groupId: string, userId: string) {
    return this.memberships.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
  }

  findActiveOwner(groupId: string, userId: string) {
    return this.memberships.findUnique({
      where: { groupId_userId: { groupId, userId } },
      select: { active: true, role: true },
    });
  }

  async findActiveUserIds(groupId: string, userIds: readonly string[]) {
    if (userIds.length === 0) {
      return new Set<string>();
    }
    const memberships = await this.memberships.findMany({
      where: {
        groupId,
        userId: { in: [...userIds] },
        active: true,
      },
      select: { userId: true },
    });
    return new Set(memberships.map(({ userId }) => userId));
  }

  create(groupId: string, userId: string) {
    return this.memberships.create({
      data: { groupId, userId },
    });
  }

  countActive(groupId: string) {
    return this.memberships.count({ where: { groupId, active: true } });
  }

  setActive(groupId: string, userId: string, active: boolean) {
    return this.memberships.update({
      where: { groupId_userId: { groupId, userId } },
      data: { active },
    });
  }
}
