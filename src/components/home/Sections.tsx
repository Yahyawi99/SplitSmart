import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRightLeft,
  Globe,
  LineChart,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  [
    "1",
    "Log an expense",
    "Add what was paid, who paid it, and how it should be split.",
  ],
  [
    "2",
    "Balances update instantly",
    "Every member's balance recalculates when an expense or payment is added.",
  ],
  [
    "3",
    "Settle with fewer payments",
    "Debt minimization finds the smallest set of payments for the group.",
  ],
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-(--text-dim)/30 bg-(--bg-sidebar)/35"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-green)">
          The workflow
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-(--text-primary)">
          How it works
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, body]) => (
            <div
              key={number}
              className="rounded-xl border border-(--text-dim)/40 bg-(--bg-sidebar) p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-green)/10 text-sm font-bold text-(--accent-green)">
                {number}
              </span>
              <h3 className="mt-4 text-base font-semibold text-(--text-primary)">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-green)">
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
              icon={<Icon className="h-5 w-5 text-(--accent-green)" />}
              title={title as string}
              body={body as string}
              flagship={index === 0}
            />
          ))}
          <FeatureCard
            className="md:col-span-6"
            icon={<ShieldAlert className="h-5 w-5 text-(--accent-green)" />}
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

export function FinalCta({ isSignedIn }: { isSignedIn: boolean }) {
  if (isSignedIn) return null;
  return (
    <section className="border-t border-(--text-dim)/30 bg-(--bg-sidebar)/35">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-(--text-primary)">
          Try it before you make an account.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--text-secondary)">
          Explore SplitSmart as a guest with a sample group, or create an
          account to start tracking your own.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            variant="outline"
            className="border-(--text-dim) bg-transparent text-(--text-primary) hover:bg-(--bg-active)"
          >
            <Link href="/app?guest=1">Continue as guest</Link>
          </Button>
          <Button
            size="lg"
            className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)"
          >
            <Link href="/sign-up">Create an account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function WelcomeFooter() {
  return (
    <footer className="border-t border-(--text-dim)/30">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs font-semibold tracking-wide text-(--text-dim) sm:px-6">
        SPLITSMART
      </div>
    </footer>
  );
}
