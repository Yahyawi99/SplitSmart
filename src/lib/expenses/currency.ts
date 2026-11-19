import { parseUnsignedDecimal } from "./decimal";
import { MAX_CENTS } from "./split/allocation";

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