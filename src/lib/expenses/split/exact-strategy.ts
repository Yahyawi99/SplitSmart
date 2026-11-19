import { SplitType } from "@/generated/prisma/enums";
import type { CalculatedSplit, ExactSplitInput, SplitStrategy } from "@/types/split";
import { MAX_CENTS } from "./allocation";

export class ExactSplitStrategy implements SplitStrategy<ExactSplitInput> {
  readonly splitType = SplitType.EXACT;

  calculate(input: ExactSplitInput): CalculatedSplit[] {
    const total = input.participants.reduce((sum, participant) => {
      if (
        !Number.isSafeInteger(participant.owedCents) ||
        participant.owedCents < 0 ||
        participant.owedCents > MAX_CENTS
      ) {
        throw new Error("Exact owedCents values must be non-negative integer cents");
      }
      return sum + BigInt(participant.owedCents);
    }, BigInt(0));

    if (total !== BigInt(input.totalCents)) {
      throw new Error("Exact split amounts must equal the converted expense total");
    }

    return input.participants
      .map(({ userId, owedCents }) => ({ userId, owedCents }))
      .sort((left, right) => (left.userId < right.userId ? -1 : left.userId > right.userId ? 1 : 0));
  }
}