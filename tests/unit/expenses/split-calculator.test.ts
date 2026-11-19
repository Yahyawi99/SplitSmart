import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SplitType } from "@/generated/prisma/enums";
import { calculateSplits } from "@/lib/expenses/split-calculator";
import { convertToHomeCurrencyCents } from "@/lib/expenses/currency";

describe("calculateSplits", () => {
  it("allocates equal-share remainder cents by user ID", () => {
    assert.deepEqual(
      calculateSplits({
        splitType: SplitType.EQUAL,
        totalCents: 100,
        participants: [{ userId: "c" }, { userId: "a" }, { userId: "b" }],
      }),
      [
        { userId: "a", owedCents: 34 },
        { userId: "b", owedCents: 33 },
        { userId: "c", owedCents: 33 },
      ],
    );
  });

  it("preserves exact home-currency amounts", () => {
    assert.deepEqual(
      calculateSplits({
        splitType: SplitType.EXACT,
        totalCents: 1000,
        participants: [
          { userId: "user-a", owedCents: 325 },
          { userId: "user-b", owedCents: 675 },
        ],
      }),
      [
        { userId: "user-a", owedCents: 325 },
        { userId: "user-b", owedCents: 675 },
      ],
    );
  });

  it("allocates percentage shares without floating-point arithmetic", () => {
    assert.deepEqual(
      calculateSplits({
        splitType: SplitType.PERCENTAGE,
        totalCents: 10_000,
        participants: [
          { userId: "a", percentage: "33.33" },
          { userId: "b", percentage: "33.33" },
          { userId: "c", percentage: "33.34" },
        ],
      }),
      [
        { userId: "a", owedCents: 3333 },
        { userId: "b", owedCents: 3333 },
        { userId: "c", owedCents: 3334 },
      ],
    );
  });

  it("allocates shares and resolves tied remainders deterministically", () => {
    assert.deepEqual(
      calculateSplits({
        splitType: SplitType.SHARES,
        totalCents: 10,
        participants: [
          { userId: "c", shares: 1 },
          { userId: "b", shares: 1 },
          { userId: "a", shares: 1 },
        ],
      }),
      [
        { userId: "a", owedCents: 4 },
        { userId: "b", owedCents: 3 },
        { userId: "c", owedCents: 3 },
      ],
    );
  });

  it("rejects invalid totals, duplicate participants, and mismatched splits", () => {
    assert.throws(
      () =>
        calculateSplits({
          splitType: SplitType.EXACT,
          totalCents: 100,
          participants: [{ userId: "a", owedCents: 99 }],
        }),
      /must equal the converted expense total/,
    );
    assert.throws(
      () =>
        calculateSplits({
          splitType: SplitType.EQUAL,
          totalCents: 100,
          participants: [{ userId: "a" }, { userId: "a" }],
        }),
      /only have one split/,
    );
    assert.throws(
      () =>
        calculateSplits({
          splitType: SplitType.PERCENTAGE,
          totalCents: 100,
          participants: [
            { userId: "a", percentage: "50" },
            { userId: "b", percentage: "49.99" },
          ],
        }),
      /total exactly 100/,
    );
  });
});

describe("convertToHomeCurrencyCents", () => {
  it("converts with decimal arithmetic and rounds half up", () => {
    assert.equal(convertToHomeCurrencyCents(101, "1.005"), 102);
  });

  it("rejects invalid or out-of-range values", () => {
    assert.throws(() => convertToHomeCurrencyCents(0, "1"), /positive 32-bit integer/);
    assert.throws(() => convertToHomeCurrencyCents(100, "0"), /greater than zero/);
    assert.throws(() => convertToHomeCurrencyCents(100, "1e2"), /decimal string/);
  });
});