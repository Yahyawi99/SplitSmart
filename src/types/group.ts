export type GroupListItem = {
  id: string;
  name: string;
  currency: string;
  balanceCents: number;
};

export type GroupsResponse = {
  groups: GroupListItem[];
  hasMore: boolean;
};

export type CreateGroupInput = {
  creatorId: string;
  name: string;
  description?: string | null;
  currency: string;
};

export type AddGroupMemberInput = {
  groupId: string;
  actorUserId: string;
  userId: string;
};

export type SetGroupMemberActiveInput = {
  groupId: string;
  actorUserId: string;
  userId: string;
  active: boolean;
};

export type GroupMemberInfo = {
  id: string;
  name: string | null;
  initials: string;
  role: "OWNER" | "MEMBER";
  active: boolean;
};

export type GroupExpenseSummary = {
  id: string;
  description: string;
  amountCents: number;
  currency: string;
  category: string;
  date: string;
  payerId: string;
  payerName: string | null;
  splits: readonly { userId: string; owedCents: number }[];
};

export type GroupSettlementSummary = {
  id: string;
  amountCents: number;
  date: string;
  fromUserId: string;
  fromUserName: string | null;
  toUserId: string;
  toUserName: string | null;
  note: string | null;
};

export type GroupDetail = {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  members: GroupMemberInfo[];
  expenses: GroupExpenseSummary[];
  settlements: GroupSettlementSummary[];
  balanceCents: number;
};

export type UserBalanceSummary = {
  userId: string;
  name: string | null;
  balanceCents: number;
  amountPaidCents: number;
  shareCents: number;
};
