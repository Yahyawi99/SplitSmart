export function formatCurrency(cents: number, currency: string) {
  const units = Math.abs(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(units);
}
