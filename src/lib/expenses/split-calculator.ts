import { SplitType } from "@/generated/prisma/enums";
import type { CalculatedSplit, SplitCalculationInput, SplitStrategyMap } from "@/types/split";
import { validateSplitRequest } from "./split/allocation";
import { EqualSplitStrategy } from "./split/equal-strategy";
import { ExactSplitStrategy } from "./split/exact-strategy";
import { PercentageSplitStrategy } from "./split/percentage-strategy";
import { SharesSplitStrategy } from "./split/shares-strategy";

const strategies: SplitStrategyMap = {
  [SplitType.EQUAL]: new EqualSplitStrategy(),
  [SplitType.EXACT]: new ExactSplitStrategy(),
  [SplitType.PERCENTAGE]: new PercentageSplitStrategy(),
  [SplitType.SHARES]: new SharesSplitStrategy(),
};

export function calculateSplits(input: SplitCalculationInput): CalculatedSplit[] {
  validateSplitRequest(input.totalCents, input.participants);

  switch (input.splitType) {
    case SplitType.EQUAL:
      return strategies[SplitType.EQUAL].calculate(input);
    case SplitType.EXACT:
      return strategies[SplitType.EXACT].calculate(input);
    case SplitType.PERCENTAGE:
      return strategies[SplitType.PERCENTAGE].calculate(input);
    case SplitType.SHARES:
      return strategies[SplitType.SHARES].calculate(input);
  }
}
