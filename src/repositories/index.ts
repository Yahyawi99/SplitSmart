import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { ExpenseRepository } from "./expense-repository";
import { ExpenseSplitRepository } from "./expense-split-repository";
import { GroupMemberRepository } from "./group-member-repository";
import { GroupRepository } from "./group-repository";
import { ReceiptRepository } from "./receipt-repository";
import { SettlementRepository } from "./settlement-repository";
import { UserRepository } from "./user-repository";

export function createRepositories(transaction: Prisma.TransactionClient) {
  return {
    users: new UserRepository(transaction.user),
    groups: new GroupRepository(transaction.group),
    groupMembers: new GroupMemberRepository(transaction.groupMember),
    expenses: new ExpenseRepository(transaction.expense),
    expenseSplits: new ExpenseSplitRepository(transaction.expenseSplit),
    settlements: new SettlementRepository(transaction.settlement),
    receipts: new ReceiptRepository(transaction.receipt),
  };
}
