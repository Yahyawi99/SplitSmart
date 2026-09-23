import {
  Header,
  SuggestedSettlementsCard,
  BalanceCard,
  GroupSettlementsCard,
  ActivityCard,
  MemberContributionChart,
  SpendingByCategoryCharts,
  SpendingOverTimeChart,
  GeneralInfo,
} from "@/components/main";

export default function Home() {
  return (
    <div className="w-full relative">
      <Header />
      <GeneralInfo />

      <div className="flex w-full gap-3 p-3 flex-wrap-reverse">
        <div className="min-w-210 flex flex-col gap-3 grow">
          <ActivityCard />
          <GroupSettlementsCard />
        </div>

        <div className="min-w-92 flex flex-col gap-3 grow">
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
