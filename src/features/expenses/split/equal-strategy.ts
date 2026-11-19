import { SplitType } from "@/generated/prisma/enums";
import type { EqualSplitInput, SplitStrategy } from "@/types/split";
import { allocateWeighted } from "./allocation";

export class EqualSplitStrategy implements SplitStrategy<EqualSplitInput> {
  readonly splitType = SplitType.EQUAL;

  calculate(input: EqualSplitInput) {
    return allocateWeighted(
      input.totalCents,
      input.participants,
      input.participants.map(() => BigInt(1)),
    );
  }
}
