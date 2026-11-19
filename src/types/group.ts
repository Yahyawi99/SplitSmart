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