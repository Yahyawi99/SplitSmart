import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateGroupBalances } from "./calculate-balances";

describe("calculateGroupBalances", () => {
  it("derives balances from converted expense facts, owed splits, and payments", () => {
    const balances = calculateGroupBalances(
      ["payer", "member"],
      [
        {
          payerId: "payer",
          amountCents: 1000,
          exchangeRate: "1.25",
          splits: [
            { userId: "payer", owedCents: 250 },
            { userId: "member", owedCents: 1000 },
          ],
        },
      ],
      [{ fromUserId: "member", toUserId: "payer", amountCents: 300 }],
    );

    assert.deepEqual([...balances.entries()], [
      ["payer", 1300],
      ["member", -1300],
    ]);
    assert.equal([...balances.values()].reduce((sum, balance) => sum + balance, 0), 0);
  });

  it("rejects corrupt split totals and references outside the group", () => {
    assert.throws(
      () =>
        calculateGroupBalances(
          ["payer", "member"],
          [
            {
              payerId: "payer",
              amountCents: 100,
              exchangeRate: "1",
              splits: [{ userId: "member", owedCents: 99 }],
            },
          ],
          [],
        ),
      /equal the converted expense total/,
    );
    assert.throws(
      () =>
        calculateGroupBalances(
          ["payer"],
          [
            {
              payerId: "outside",
              amountCents: 100,
              exchangeRate: "1",
              splits: [{ userId: "payer", owedCents: 100 }],
            },
          ],
          [],
        ),
      /non-member/,
    );
  });
});