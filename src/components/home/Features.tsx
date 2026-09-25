import type { ReactNode } from "react";
import {
  ArrowRightLeft,
  Globe,
  LineChart,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react";

const features = [
  [
    ArrowRightLeft,
    "Settle with fewer payments",
    "SplitSmart computes the smallest possible set of transactions to zero out the group's balances.",
  ],
  [
    ScanLine,
    "Scan a receipt",
    "Photograph a receipt and confirm the extracted line items before saving.",
  ],
  [
    Users,
    "Split it your way",
    "Use equal, exact, percentage, or weighted-share splits.",
  ],
  [
    Globe,
    "Built for multi-currency trips",
    "Keep the exchange rate from the day each expense happened.",
  ],
  [
    LineChart,
    "See where the money went",
    "Explore spending over time, by category, and by member.",
  ],
];

export function Features() {
  return (
    <section id="features">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">
          Built for groups
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-(--text-primary)">
          Everything stays visible
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-6">
          {features.map(([Icon, title, body], index) => (
            <FeatureCard
              key={title as string}
              className={
                index === 0
                  ? "md:col-span-3 md:row-span-2"
                  : index === 1
                    ? "md:col-span-3"
                    : "md:col-span-2"
              }
              icon={<Icon className="h-5 w-5 text-(--accent-blue)" />}
              title={title as string}
              body={body as string}
              flagship={index === 0}
            />
          ))}

          <FeatureCard
            className="md:col-span-6"
            icon={<ShieldAlert className="h-5 w-5 text-(--accent-blue)" />}
            title="Catch imbalances early"
            body="If someone's contributions drift from the agreed split, SplitSmart flags it before the end of the trip."
            banner
          />
        </div>
        
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  className = "",
  flagship = false,
  banner = false,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  className?: string;
  flagship?: boolean;
  banner?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-(--text-dim)/40 bg-(--bg-sidebar) p-5 ${banner ? "flex items-start gap-4 md:items-center" : ""} ${className}`}
    >
      <div className="shrink-0">{icon}</div>
      <div className={banner ? "" : "mt-4"}>
        <h3
          className={
            flagship
              ? "text-lg font-semibold text-(--text-primary)"
              : "text-sm font-semibold text-(--text-primary)"
          }
        >
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{body}</p>
      </div>
    </div>
  );
}
