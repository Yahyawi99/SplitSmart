import type { CalculatedSplit, SplitParticipant } from "@/types/split";

export const MAX_CENTS = 2_147_483_647;

export function validateSplitRequest(
  totalCents: number,
  participants: readonly SplitParticipant[],
): void {
  if (
    !Number.isSafeInteger(totalCents) ||
    totalCents <= 0 ||
    totalCents > MAX_CENTS
  ) {
    throw new Error("totalCents must be a positive 32-bit integer");
  }
  if (participants.length === 0) {
    throw new Error("At least one split participant is required");
  }

  const userIds = new Set<string>();
  for (const { userId } of participants) {
    if (!userId.trim()) {
      throw new Error("Split participant userId is required");
    }
    if (userIds.has(userId)) {
      throw new Error("A user can only have one split per expense");
    }
    userIds.add(userId);
  }
}

export function allocateWeighted(
  totalCents: number,
  participants: readonly SplitParticipant[],
  weights: readonly bigint[],
): CalculatedSplit[] {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, BigInt(0));
  if (totalWeight <= BigInt(0)) {
    throw new Error("Split weights must total more than zero");
  }

  const total = BigInt(totalCents);
  const allocations = participants.map((participant, index) => {
    const weightedCents = total * weights[index];
    return {
      userId: participant.userId,
      owedCents: Number(weightedCents / totalWeight),
      remainder: weightedCents % totalWeight,
    };
  });
  const unallocatedCents =
    totalCents -
    allocations.reduce((sum, allocation) => sum + allocation.owedCents, 0);
  const recipients = [...allocations]
    .sort((left, right) => {
      if (left.remainder !== right.remainder) {
        return left.remainder > right.remainder ? -1 : 1;
      }
      return left.userId < right.userId
        ? -1
        : left.userId > right.userId
          ? 1
          : 0;
    })
    .slice(0, unallocatedCents);
  const extraCentRecipients = new Set(recipients.map(({ userId }) => userId));

  return allocations
    .map(({ userId, owedCents }) => ({
      userId,
      owedCents: owedCents + Number(extraCentRecipients.has(userId)),
    }))
    .sort((left, right) =>
      left.userId < right.userId ? -1 : left.userId > right.userId ? 1 : 0,
    );
}
