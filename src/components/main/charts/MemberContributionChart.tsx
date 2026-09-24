import ChartCard from "./ChartCard";

interface MemberContributionChartProps {
  data?: unknown;
}

export default function MemberContributionChart({
  data = [],
}: Partial<MemberContributionChartProps>) {
  return (
    <ChartCard
      title="Member Contribution"
      description="Compare each member's contribution."
      fileName="member-contribution"
      data={data}
    >
      <div className="flex min-h-56 items-center justify-center text-sm text-(--text-primary) w-full bg-(--bg-sidebar) ">
        Chart coming soon
      </div>
    </ChartCard>
  );
}
