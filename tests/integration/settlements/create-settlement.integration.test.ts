import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "@jest/globals";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createGroup } from "@/lib/groups/create-group";
import { addGroupMember } from "@/lib/groups/membership";
import * as settlementService from "@/lib/settlements/create-settlement";
import { createSettlement } from "@/lib/settlements/create-settlement";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

const databaseTests = testDatabaseUrl ? describe : describe.skip;

databaseTests(
  "settlements require distinct active group members and remain create-only",
  () => {
    it("validates settlement facts and exposes no mutation operations", async () => {
    const client = new PrismaClient({
      adapter: new PrismaPg({ connectionString: testDatabaseUrl! }),
    });
    const userIds = [randomUUID(), randomUUID(), randomUUID()];
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

      const group = await createGroup(
        { creatorId: userIds[0], name: "Settlement test group", currency: "USD" },
        client,
      );
      groupIds.push(group.id);
      await addGroupMember(
        { groupId: group.id, actorUserId: userIds[0], userId: userIds[1] },
        client,
      );

      const settlement = await createSettlement(
        {
          groupId: group.id,
          actorUserId: userIds[0],
          fromUserId: userIds[1],
          toUserId: userIds[0],
          amountCents: 500,
          date: new Date("2026-11-19T12:00:00.000Z"),
        },
        client,
      );
      assert.equal(settlement.amountCents, 500);

      for (const amountCents of [0, -1]) {
        await assert.rejects(
          createSettlement(
            {
              groupId: group.id,
              actorUserId: userIds[0],
              fromUserId: userIds[1],
              toUserId: userIds[0],
              amountCents,
              date: new Date(),
            },
            client,
          ),
          /positive 32-bit integer/,
        );
      }
      await assert.rejects(
        createSettlement(
          {
            groupId: group.id,
            actorUserId: userIds[0],
            fromUserId: userIds[0],
            toUserId: userIds[0],
            amountCents: 100,
            date: new Date(),
          },
          client,
        ),
        /must be different/,
      );
      await assert.rejects(
        createSettlement(
          {
            groupId: group.id,
            actorUserId: userIds[0],
            fromUserId: userIds[1],
            toUserId: userIds[2],
            amountCents: 100,
            date: new Date(),
          },
          client,
        ),
        /active group members/,
      );

      assert.equal("updateSettlement" in settlementService, false);
      assert.equal("deleteSettlement" in settlementService, false);

      await client.group.delete({ where: { id: group.id } });
      assert.equal(await client.settlement.findUnique({ where: { id: settlement.id } }), null);
    } finally {
      await client.group.deleteMany({ where: { id: { in: groupIds } } });
      await client.user.deleteMany({ where: { id: { in: userIds } } });
      await client.$disconnect();
    }
    });
  },
);