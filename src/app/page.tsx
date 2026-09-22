import {
  Header,
  SuggestedSettlementsCard,
  BalanceCard,
  GroupSettlementsCard,
  ActivityCard,
} from "@/components/main";

export default function Home() {
  return (
    <div className="w-full">
      <Header />

      <div className="flex flex-&">
        <ActivityCard />

        <div>
          <BalanceCard />
          <SuggestedSettlementsCard />
          <GroupSettlementsCard />
        </div>
      </div>
    </div>
  );
}
