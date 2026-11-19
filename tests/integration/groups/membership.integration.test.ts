import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "@jest/globals";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createGroup } from "@/lib/groups/create-group";
import { addGroupMember, setGroupMemberActive } from "@/lib/groups/membership";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

const databaseTests = testDatabaseUrl ? describe : describe.skip;

databaseTests(
  "group membership is unique, reusable across groups, and deactivated without deleting history",
  () => {
    it("keeps memberships unique, multi-group, and historically associated", async () => {
      const client = new PrismaClient({
        adapter: new PrismaPg({ connectionString: testDatabaseUrl! }),
      });
      const userIds = [randomUUID(), randomUUID()];
      const groupIds: string[] = [];

      await client.$connect();
      try {
        await client.user.createMany({
          data: userIds.map((id) => ({
            id,
            name: "Integration Test User",
            email: `${id}@example.test`,
            updatedAt: new Date(),
          })),
        });

        const firstGroup = await createGroup(
          { creatorId: userIds[0], name: "First test group", currency: "USD" },
          client,
        );
        groupIds.push(firstGroup.id);
        const secondGroup = await createGroup(
          { creatorId: userIds[0], name: "Second test group", currency: "EUR" },
          client,
        );
        groupIds.push(secondGroup.id);

        assert.equal(firstGroup.members.length, 1);
        assert.equal(firstGroup.members[0].role, "OWNER");

        await addGroupMember(
          {
            groupId: firstGroup.id,
            actorUserId: userIds[0],
            userId: userIds[1],
          },
          client,
        );
        await addGroupMember(
          {
            groupId: secondGroup.id,
            actorUserId: userIds[0],
            userId: userIds[1],
          },
          client,
        );

        assert.equal(
          await client.groupMember.count({ where: { userId: userIds[1] } }),
          2,
        );
        await assert.rejects(
          addGroupMember(
            {
              groupId: firstGroup.id,
              actorUserId: userIds[0],
              userId: userIds[1],
            },
            client,
          ),
        );

        const deactivated = await setGroupMemberActive(
          {
            groupId: firstGroup.id,
            actorUserId: userIds[0],
            userId: userIds[1],
            active: false,
          },
          client,
        );
        assert.equal(deactivated.active, false);

        await assert.rejects(
          setGroupMemberActive(
            {
              groupId: firstGroup.id,
              actorUserId: userIds[0],
              userId: userIds[0],
              active: false,
            },
            client,
          ),
          /at least one active member/,
        );
      } finally {
        await client.group.deleteMany({ where: { id: { in: groupIds } } });
        await client.user.deleteMany({ where: { id: { in: userIds } } });
        await client.$disconnect();
      }
    });
  },
);
