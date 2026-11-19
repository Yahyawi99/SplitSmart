export type CreateSettlementInput = {
  groupId: string;
  actorUserId: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  date: Date;
  note?: string | null;
};

export type BalanceSettlement = {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
};