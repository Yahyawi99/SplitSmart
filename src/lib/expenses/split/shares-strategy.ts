import { SplitType } from "@/generated/prisma/enums";
import type { SharesSplitInput, SplitStrategy } from "@/types/split";
import { allocateWeighted } from "./allocation";

export class SharesSplitStrategy implements SplitStrategy<SharesSplitInput> {
  readonly splitType = SplitType.SHARES;

  calculate(input: SharesSplitInput) {
    const weights = input.participants.map(({ shares }) => {
      if (!Number.isSafeInteger(shares) || shares <= 0) {
        throw new Error("Shares must be positive integers");
      }
      return BigInt(shares);
    });

    return allocateWeighted(input.totalCents, input.participants, weights);
  }
}