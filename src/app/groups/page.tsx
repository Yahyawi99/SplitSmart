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

      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-3 p-3 flex-wrap-reverse">
        <div className="grid grid-cols-1 gap-3 xl:col-span-2">
          <ActivityCard />
          <GroupSettlementsCard />
        </div>

        <div className="h-fit grid grid-cols-1 gap-3 xl:col-span-1">
          <BalanceCard />
          <SuggestedSettlementsCard />
        </div>
      </div>

      <div className=" grid grid-cols-1 gap-3 xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] p-3">
        <SpendingOverTimeChart />
        <SpendingByCategoryCharts />
        <MemberContributionChart />
      </div>
    </div>
  );
}
