import type { SplitType } from "@/generated/prisma/enums";

export type SplitParticipant = { userId: string };

export type EqualSplitInput = {
  splitType: typeof SplitType.EQUAL;
  totalCents: number;
  participants: readonly SplitParticipant[];
};

export type ExactSplitInput = {
  splitType: typeof SplitType.EXACT;
  totalCents: number;
  participants: readonly (SplitParticipant & { owedCents: number })[];
};

export type PercentageSplitInput = {
  splitType: typeof SplitType.PERCENTAGE;
  totalCents: number;
  participants: readonly (SplitParticipant & { percentage: string })[];
};

export type SharesSplitInput = {
  splitType: typeof SplitType.SHARES;
  totalCents: number;
  participants: readonly (SplitParticipant & { shares: number })[];
};

export type SplitCalculationInput =
  | EqualSplitInput
  | ExactSplitInput
  | PercentageSplitInput
  | SharesSplitInput;

export type CalculatedSplit = { userId: string; owedCents: number };

export interface SplitStrategy<T extends SplitCalculationInput = SplitCalculationInput> {
  readonly splitType: T["splitType"];
  calculate(input: T): CalculatedSplit[];
}

export type SplitStrategyMap = {
  [Kind in SplitType]: SplitStrategy<
    Extract<SplitCalculationInput, { splitType: Kind }>
  >;
};