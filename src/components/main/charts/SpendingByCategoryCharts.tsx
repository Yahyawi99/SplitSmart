import ChartCard from "./ChartCard";

interface SpendingByCategoryChartsProps {
  data?: unknown;
}

export default function SpendingByCategoryCharts({
  data = [],
}: Partial<SpendingByCategoryChartsProps>) {
  return (
    <ChartCard
      title="Spending by Category"
      description="See where the group's money is going."
      fileName="spending-by-category"
      data={data}
    >
      <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-(--text-dim)/50 text-sm text-(--text-secondary)">
        Chart coming soon
      </div>
    </ChartCard>
  );
}
