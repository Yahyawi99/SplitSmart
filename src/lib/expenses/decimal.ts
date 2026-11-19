export type DecimalParts = { coefficient: bigint; scale: number };

const MAX_DECIMAL_PLACES = 12;

export function parseUnsignedDecimal(
  value: string,
  fieldName: string,
): DecimalParts {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(value);
  if (!match) {
    throw new Error(`${fieldName} must be a non-negative decimal string`);
  }

  const fraction = match[2] ?? "";
  if (fraction.length > MAX_DECIMAL_PLACES) {
    throw new Error(
      `${fieldName} supports at most ${MAX_DECIMAL_PLACES} decimal places`,
    );
  }

  return {
    coefficient: BigInt(`${match[1]}${fraction}`),
    scale: fraction.length,
  };
}
