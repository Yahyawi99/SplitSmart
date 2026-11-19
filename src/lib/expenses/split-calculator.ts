import type { SplitType } from "@/generated/prisma/enums";

const MAX_CENTS = 2_147_483_647;
const MAX_DECIMAL_PLACES = 12;

type Participant = { userId: string };

export type SplitCalculationInput =
  | {
      splitType: typeof SplitType.EQUAL;
      totalCents: number;
      participants: readonly Participant[];
    }
  | {
      splitType: typeof SplitType.EXACT;
      totalCents: number;
      participants: readonly (Participant & { owedCents: number })[];
    }
  | {
      splitType: typeof SplitType.PERCENTAGE;
      totalCents: number;
      participants: readonly (Participant & { percentage: string })[];
    }
  | {
      splitType: typeof SplitType.SHARES;
      totalCents: number;
      participants: readonly (Participant & { shares: number })[];
    };

export type CalculatedSplit = { userId: string; owedCents: number };

type DecimalParts = { coefficient: bigint; scale: number };

function parseUnsignedDecimal(value: string, fieldName: string): DecimalParts {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value);
  if (!match) {
    throw new Error(`${fieldName} must be a non-negative decimal string`);
  }

  const fraction = match[2] ?? "";
  if (fraction.length > MAX_DECIMAL_PLACES) {
    throw new Error(`${fieldName} supports at most ${MAX_DECIMAL_PLACES} decimal places`);
  }

  return {
    coefficient: BigInt(`${match[1]}${fraction}`),
    scale: fraction.length,
  };
}

function validateCents(totalCents: number): void {
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0 || totalCents > MAX_CENTS) {
    throw new Error("totalCents must be a positive 32-bit integer");
  }
}

function validateParticipants<T extends Participant>(
  participants: readonly T[],
): void {
  if (participants.length === 0) {
    throw new Error("At least one split participant is required");
  }

  const userIds = new Set<string>();
  for (const participant of participants) {
    if (!participant.userId.trim()) {
      throw new Error("Split participant userId is required");
    }
    if (userIds.has(participant.userId)) {
      throw new Error("A user can only have one split per expense");
    }
    userIds.add(participant.userId);
  }
}

function sortByRemainder(
  allocations: readonly { userId: string; remainder: bigint }[],
): { userId: string; remainder: bigint }[] {
  return [...allocations].sort((left, right) => {
    if (left.remainder !== right.remainder) {
      return left.remainder > right.remainder ? -1 : 1;
    }
    return left.userId < right.userId ? -1 : left.userId > right.userId ? 1 : 0;
  });
}

function allocateWeighted(
  totalCents: number,
  participants: readonly Participant[],
  weights: readonly bigint[],
): CalculatedSplit[] {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, BigInt(0));
  if (totalWeight <= BigInt(0)) {
    throw new Error("Split weights must total more than zero");
  }

  const total = BigInt(totalCents);
  const baseAllocations = participants.map((participant, index) => {
    const weightedCents = total * weights[index];
    return {
      userId: participant.userId,
      owedCents: Number(weightedCents / totalWeight),
      remainder: weightedCents % totalWeight,
    };
  });
  const unallocatedCents =
    totalCents - baseAllocations.reduce((sum, allocation) => sum + allocation.owedCents, 0);
  const remainderOrder = sortByRemainder(baseAllocations);
  const extraCentRecipients = new Set(
    remainderOrder.slice(0, unallocatedCents).map((allocation) => allocation.userId),
  );

  return baseAllocations
    .map(({ userId, owedCents }) => ({
      userId,
      owedCents: owedCents + Number(extraCentRecipients.has(userId)),
    }))
    .sort((left, right) => (left.userId < right.userId ? -1 : left.userId > right.userId ? 1 : 0));
}

export function convertToHomeCurrencyCents(
  amountCents: number,
  exchangeRate: string,
): number {
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents > MAX_CENTS) {
    throw new Error("amountCents must be a positive 32-bit integer");
  }

  const rate = parseUnsignedDecimal(exchangeRate, "exchangeRate");
  if (rate.coefficient <= BigInt(0)) {
    throw new Error("exchangeRate must be greater than zero");
  }

  const numerator = BigInt(amountCents) * rate.coefficient;
  const denominator = BigInt(10) ** BigInt(rate.scale);
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  const roundedCents = Number(
    quotient + (remainder * BigInt(2) >= denominator ? BigInt(1) : BigInt(0)),
  );

  if (!Number.isSafeInteger(roundedCents) || roundedCents <= 0 || roundedCents > MAX_CENTS) {
    throw new Error("Converted total must be a positive 32-bit integer");
  }
  return roundedCents;
}

export function isUnitExchangeRate(exchangeRate: string): boolean {
  const rate = parseUnsignedDecimal(exchangeRate, "exchangeRate");
  return rate.coefficient === BigInt(10) ** BigInt(rate.scale);
}

export function calculateSplits(input: SplitCalculationInput): CalculatedSplit[] {
  validateCents(input.totalCents);
  validateParticipants(input.participants);

  if (input.splitType === "EXACT") {
    const total = input.participants.reduce((sum, participant) => {
      if (!Number.isSafeInteger(participant.owedCents) || participant.owedCents < 0) {
        throw new Error("Exact owedCents values must be non-negative integers");
      }
      return sum + participant.owedCents;
    }, 0);

    if (total !== input.totalCents) {
      throw new Error("Exact split amounts must equal the converted expense total");
    }

    return input.participants
      .map(({ userId, owedCents }) => ({ userId, owedCents }))
      .sort((left, right) => (left.userId < right.userId ? -1 : left.userId > right.userId ? 1 : 0));
  }

  if (input.splitType === "EQUAL") {
    return allocateWeighted(
      input.totalCents,
      input.participants,
      input.participants.map(() => BigInt(1)),
    );
  }

  if (input.splitType === "SHARES") {
    const weights = input.participants.map(({ shares }) => {
      if (!Number.isSafeInteger(shares) || shares <= 0) {
        throw new Error("Shares must be positive integers");
      }
      return BigInt(shares);
    });
    return allocateWeighted(input.totalCents, input.participants, weights);
  }

  const percentages = input.participants.map(({ percentage }) =>
    parseUnsignedDecimal(percentage, "percentage"),
  );
  const commonScale = Math.max(...percentages.map(({ scale }) => scale));
  const weights = percentages.map(({ coefficient, scale }) =>
    coefficient * BigInt(10) ** BigInt(commonScale - scale),
  );
  const expectedTotal = BigInt(100) * BigInt(10) ** BigInt(commonScale);
  if (weights.reduce((sum, weight) => sum + weight, BigInt(0)) !== expectedTotal) {
    throw new Error("Percentages must total exactly 100");
  }

  return allocateWeighted(input.totalCents, input.participants, weights);
}