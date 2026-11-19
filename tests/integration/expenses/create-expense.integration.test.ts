import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "@jest/globals";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SplitType } from "@/generated/prisma/enums";
import type { CreateExpenseInput } from "@/types/expense";
import { createGroup } from "@/lib/groups/create-group";
import { addGroupMember, setGroupMemberActive } from "@/lib/groups/membership";
import { createExpense } from "@/lib/expenses/create-expense";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

const databaseTests = testDatabaseUrl ? describe : describe.skip;

databaseTests(
  "expense creation validates group membership, preserves currency facts, and rolls back split failures",
  () => {
    it("validates participants, preserves currency facts, and rolls back failed splits", async () => {
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
          {
            creatorId: userIds[0],
            name: "Expense test group",
            currency: "USD",
          },
          client,
        );
        groupIds.push(group.id);
        await addGroupMember(
          { groupId: group.id, actorUserId: userIds[0], userId: userIds[1] },
          client,
        );

        const expenseInput: CreateExpenseInput = {
          groupId: group.id,
          actorUserId: userIds[0],
          payerId: userIds[0],
          description: "Foreign currency expense",
          amountCents: 1000,
          currency: "EUR",
          exchangeRate: "1.25",
          category: "travel",
          splitType: SplitType.EQUAL,
          date: new Date("2026-11-19T12:00:00.000Z"),
          participants: [{ userId: userIds[0] }, { userId: userIds[1] }],
        };
        const expense = await createExpense(expenseInput, client);

        assert.equal(expense.amountCents, 1000);
        assert.equal(expense.currency, "EUR");
        assert.equal(expense.exchangeRate.toString(), "1.25");
        assert.equal(
          expense.splits.reduce((sum, split) => sum + split.owedCents, 0),
          1250,
        );

        await assert.rejects(
          createExpense({ ...expenseInput, payerId: userIds[2] }, client),
          /payer must be an active group member/,
        );
        await assert.rejects(
          createExpense(
            {
              ...expenseInput,
              participants: [{ userId: userIds[0] }, { userId: userIds[2] }],
            },
            client,
          ),
          /split participant must be an active group member/,
        );
        await assert.rejects(
          createExpense(
            {
              ...expenseInput,
              splitType: SplitType.EXACT,
              participants: [
                { userId: userIds[0], owedCents: 500 },
                { userId: userIds[1], owedCents: 749 },
              ],
            },
            client,
          ),
          /must equal the converted expense total/,
        );

        const failingClient = {
          $transaction: (
            callback: (transaction: unknown) => Promise<unknown>,
            options: unknown,
          ) =>
            client.$transaction((transaction) => {
              const splitDelegate = new Proxy(transaction.expenseSplit, {
                get(target, property, receiver) {
                  if (property === "createMany") {
                    return async () => {
                      throw new Error("forced split insert failure");
                    };
                  }
                  return Reflect.get(target, property, receiver);
                },
              });
              const transactionProxy = new Proxy(transaction, {
                get(target, property, receiver) {
                  if (property === "expenseSplit") {
                    return splitDelegate;
                  }
                  return Reflect.get(target, property, receiver);
                },
              });
              return callback(transactionProxy);
            }, options as never),
        } as unknown as PrismaClient;

        const expenseCountBeforeFailure = await client.expense.count({
          where: { groupId: group.id },
        });
        await assert.rejects(
          createExpense(expenseInput, failingClient),
          /forced split insert failure/,
        );
        assert.equal(
          await client.expense.count({ where: { groupId: group.id } }),
          expenseCountBeforeFailure,
        );

        await assert.rejects(
          client.expenseSplit.create({
            data: {
              expenseId: expense.id,
              userId: userIds[0],
              owedCents: 1250,
            },
          }),
        );

        await setGroupMemberActive(
          {
            groupId: group.id,
            actorUserId: userIds[0],
            userId: userIds[1],
            active: false,
          },
          client,
        );
        assert.equal(
          await client.expenseSplit.count({
            where: { expenseId: expense.id, userId: userIds[1] },
          }),
          1,
        );
      } finally {
        await client.group.deleteMany({ where: { id: { in: groupIds } } });
        await client.user.deleteMany({ where: { id: { in: userIds } } });
        await client.$disconnect();
      }
    });
  },
);
