import { SplitType } from "@/generated/prisma/enums";
import type { PercentageSplitInput, SplitStrategy } from "@/types/split";
import { parseUnsignedDecimal } from "../decimal";
import { allocateWeighted } from "./allocation";

export class PercentageSplitStrategy implements SplitStrategy<PercentageSplitInput> {
  readonly splitType = SplitType.PERCENTAGE;

  calculate(input: PercentageSplitInput) {
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
}