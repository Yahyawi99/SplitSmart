import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/database/prisma";
import {
  Header,
  GeneralInfo,
  ActivityCard,
  BalanceCard,
  GroupSettlementsCard,
  SuggestedSettlementsCard,
  MemberContributionChart,
  SpendingByCategoryCharts,
  SpendingOverTimeChart,
} from "@/components/main";
import { getInitials } from "@/utils/initials";
import { mapGroupToActivityItems, calculateUserBalance } from "@/utils/group-mapping";
import type { GroupMemberInfo } from "@/types/group";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
    select: { active: true },
  });

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: { user: true },
        where: { active: true },
      },
      expenses: {
        include: {
          payer: true,
          splits: true,
        },
        orderBy: { date: "desc" },
      },
      settlements: {
        include: {
          sender: true,
          receiver: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  const totalSpentCents = group?.expenses.reduce(
    (sum, e) => sum + e.amountCents,
    0
  ) ?? 0;
  const expenseCount = group?.expenses.length ?? 0;

  const members: GroupMemberInfo[] = group?.members.map((m) => ({
    id: m.userId,
    name: m.user.name,
    initials: getInitials(m.user.name),
    role: m.role,
    active: m.active,
  })) ?? [];

  const settlements = group?.settlements.map((s) => ({
    id: s.id,
    amountCents: s.amountCents,
    date: s.date,
    fromUserId: s.fromUserId,
    fromUserName: s.sender.name,
    toUserId: s.toUserId,
    toUserName: s.receiver.name,
    note: s.note,
  })) ?? [];

  const allItems = mapGroupToActivityItems(
    group?.expenses ?? [],
    settlements,
    group?.currency ?? "USD"
  );
  const settlementCount = settlements.length;

  const balance = calculateUserBalance(
    group?.expenses ?? [],
    settlements,
    session.user.id
  );

  return (
    <div className="w-full relative">
      <Header groupId={groupId} />
      {!group || !membership?.active ? (
        <div className="p-8 text-center">
          <p className="text-(--text-secondary)">
            Group not found or you don't have access to this group.
          </p>
        </div>
      ) : (
        <>
          <GeneralInfo
            title={group.name}
            description={group.description}
            totalSpentCents={totalSpentCents}
            expenseCount={expenseCount}
            currency={group.currency}
            members={members}
            loading={!group || !membership?.active}
          />

          <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-3 p-3 flex-wrap-reverse">
            <div className="grid grid-cols-1 gap-3 xl:col-span-2">
              <ActivityCard
                items={allItems}
                expenseCount={expenseCount}
                settlementCount={settlementCount}
              />
              <GroupSettlementsCard />
            </div>

            <div className="h-fit grid grid-cols-1 gap-3 xl:col-span-1">
              <BalanceCard
                balanceCents={balance.balanceCents}
                amountPaidCents={balance.amountPaidCents}
                shareCents={balance.shareCents}
                currency={group.currency}
              />
              <SuggestedSettlementsCard />
            </div>
          </div>

          <div className=" grid grid-cols-1 gap-3 xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] p-3">
            <SpendingOverTimeChart />
            <SpendingByCategoryCharts />
            <MemberContributionChart />
          </div>
        </>
      )}
    </div>
  );
}