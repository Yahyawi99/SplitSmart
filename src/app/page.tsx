import {
  Header,
  SuggestedSettlementsCard,
  BalanceCard,
  GroupSettlementsCard,
  ActivityCard,
  MemberContributionChart,
  SpendingByCategoryCharts,
  SpendingOverTimeChart,
} from "@/components/main";

export default function Home() {
  return (
    <div className="w-full">
      <Header />

      <div className="flex flex-&">
        <div>
          <ActivityCard />
          <GroupSettlementsCard />
        </div>

        <div>
          <BalanceCard />
          <SuggestedSettlementsCard />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SpendingOverTimeChart />
        <SpendingByCategoryCharts />
        <MemberContributionChart />
      </div>
    </div>
  );
}
