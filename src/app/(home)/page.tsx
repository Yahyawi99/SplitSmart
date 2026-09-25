import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  ScanLine,
  Users,
  Globe,
  LineChart,
  ShieldAlert,
} from "lucide-react";

interface WelcomePageProps {
  /** Pass the real session state once auth is wired up. */
  isSignedIn?: boolean;
}

/**
 * Informational layer shown before a user enters the main app.
 * Route this at `/welcome` or as `app/(marketing)/page.tsx`,
 * and redirect signed-in users straight past it if you'd rather
 * they never see it after their first visit.
 */
export default function Page({ isSignedIn = false }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-bg-base  text-text-primary">
      <Nav isSignedIn={isSignedIn} />
      <Hero isSignedIn={isSignedIn} />
      <HowItWorks />
      <Features />
      <FinalCta isSignedIn={isSignedIn} />
      <Footer />
    </div>
  );
}

function Nav({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className=" text-[15px] tracking-tight text-text-primary">
          split<span className="text-accent-green">smart</span>
        </span>
        <nav className="hidden items-center gap-8 text-sm text-text-secondary md:flex">
          <a href="#how-it-works" className="hover:text-text-primary">
            How it works
          </a>
          <a href="#features" className="hover:text-text-primary">
            Features
          </a>
        </nav>
        {isSignedIn ? (
          <Button className="bg-accent-blue text-white hover:bg-accent-blue/90">
            <Link href="/groups">Go to your groups</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Sign in
            </Link>
            <Button className="bg-accent-blue text-white hover:bg-accent-blue/90">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
      <div>
        <h1 className="text-4xl leading-[1.15] text-text-primary md:text-5xl">
          See who owes what, and the fastest way to fix it.
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-text-secondary">
          Log shared expenses, split them the way your group actually agreed —
          evenly, by exact amount, percentage, or shares — and let SplitSmart
          work out the smallest number of payments to settle everyone up.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          {isSignedIn ? (
            <Button
              size="lg"
              className="bg-accent-blue text-white hover:bg-accent-blue/90"
            >
              <Link href="/groups">Go to your groups</Link>
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 bg-transparent text-text-primary hover:bg-white/5"
              >
                <Link href="/app?guest=1">Continue as guest</Link>
              </Button>
              <Button
                size="lg"
                className="bg-accent-blue text-white hover:bg-accent-blue/90"
              >
                <Link href="/sign-up">Create an account</Link>
              </Button>
            </>
          )}
        </div>

        {!isSignedIn && (
          <p className="mt-4 text-sm text-text-dim">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-text-secondary underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

      <LedgerVisual />
    </section>
  );
}

/**
 * The one bold moment on the page: a small static "ledger" showing
 * three raw balances resolving into a single minimal settlement —
 * a literal preview of the debt-minimization algorithm, not a stock graphic.
 */
function LedgerVisual() {
  return (
    <div className="rounded-lg border border-white/10 bg-bg-surface p-6">
      <p className="text-sm text-text-muted">Trip to Japan · 4 members</p>

      <div className="mt-5 space-y-3  text-sm">
        <LedgerRow name="Sam Rivera" amount="+$216.47" tone="green" />
        <LedgerRow name="Jordan Park" amount="&minus;$3.02" tone="dim" />
        <LedgerRow name="Taylor Kim" amount="&minus;$213.45" tone="dim" />
        <LedgerRow name="Alex Chen" amount="$0.00" tone="dim" />
      </div>

      <div className="my-5 border-t border-dashed border-white/10" />

      <p className="text-sm text-text-muted">Minimal settlement plan</p>
      <div className="mt-3 flex items-center gap-3 rounded-md border border-accent-green-bg bg-accent-green-bg/40 px-4 py-3">
        <ArrowRightLeft className="h-4 w-4 shrink-0 text-accent-green" />
        <p className=" text-sm text-text-primary">
          Taylor Kim <span className="text-text-muted">pays</span> Sam Rivera{" "}
          <span className="text-accent-green">$213.45</span>
        </p>
      </div>
      <p className="mt-3 text-sm text-text-dim">
        1 payment instead of 3 — everyone&apos;s squared up.
      </p>
    </div>
  );
}

function LedgerRow({
  name,
  amount,
  tone,
}: {
  name: string;
  amount: string;
  tone: "green" | "dim";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className=" text-text-secondary">{name}</span>
      <span
        className={tone === "green" ? "text-accent-green" : "text-text-dim"}
        dangerouslySetInnerHTML={{ __html: amount }}
      />
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Log an expense",
      body: "Add what was paid, who paid it, and how it should be split — evenly, by exact amount, percentage, or shares.",
    },
    {
      n: "2",
      title: "Balances update instantly",
      body: "Every member's balance recalculates the moment an expense or payment is added. No manual math, no shared spreadsheet.",
    },
    {
      n: "3",
      title: "Settle with the fewest payments",
      body: "We run a debt-minimization algorithm to find the smallest set of payments that squares the whole group up.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl text-text-primary">How it works</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className=" text-sm text-accent-green">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg text-text-primary">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl text-text-primary">
          What you can do with a group
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
          <FeatureCard
            className="md:col-span-3 md:row-span-2"
            icon={<ArrowRightLeft className="h-5 w-5 text-accent-green" />}
            title="Settle with the fewest payments"
            body="Instead of every member paying every other member back, SplitSmart computes the smallest possible set of transactions to zero out the whole group's balances."
            flagship
          />
          <FeatureCard
            className="md:col-span-3"
            icon={<ScanLine className="h-5 w-5 text-accent-green" />}
            title="Scan a receipt instead of typing it"
            body="Photograph a receipt and we'll pull out the line items and suggest a category — you confirm before anything is saved."
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<Users className="h-5 w-5 text-accent-green" />}
            title="Split it your way"
            body="Equal, exact amounts, percentages, or weighted shares — pick whatever actually matches what happened."
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<Globe className="h-5 w-5 text-accent-green" />}
            title="Built for multi-currency trips"
            body="Every expense keeps the exchange rate from the day it happened, so past balances never quietly shift."
          />
          <FeatureCard
            className="md:col-span-2"
            icon={<LineChart className="h-5 w-5 text-accent-green" />}
            title="See where the money went"
            body="Spending over time, by category, and by member — the same data your expenses already have, made visible."
          />
          <FeatureCard
            className="md:col-span-6"
            icon={<ShieldAlert className="h-5 w-5 text-accent-green" />}
            title="A heads-up when one person is covering more than their share"
            body="If someone's contributions drift far from what the group agreed to split, SplitSmart flags it — so an imbalance gets noticed in week one, not after the trip is over."
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
  icon: React.ReactNode;
  title: string;
  body: string;
  className?: string;
  flagship?: boolean;
  banner?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-bg-surface p-6 ${
        banner ? "flex items-start gap-4 md:items-center" : ""
      } ${className}`}
    >
      {banner ? (
        <>
          <div className="shrink-0">{icon}</div>
          <div>
            <h3 className="text-[15px] text-text-primary">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {body}
            </p>
          </div>
        </>
      ) : (
        <>
          {icon}
          <h3
            className={`mt-4 text-text-primary ${
              flagship ? "text-xl" : "text-[15px]"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-2 leading-relaxed text-text-secondary ${
              flagship ? "text-[15px]" : "text-sm"
            }`}
          >
            {body}
          </p>
        </>
      )}
    </div>
  );
}

function FinalCta({ isSignedIn }: { isSignedIn: boolean }) {
  if (isSignedIn) return null;

  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl text-text-primary">
          Try it before you make an account.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-text-secondary">
          Explore SplitSmart as a guest with a sample group, or sign up to start
          tracking your own.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            className="border-white/15 bg-transparent text-text-primary hover:bg-white/5"
          >
            <Link href="/app?guest=1">Continue as guest</Link>
          </Button>
          <Button
            size="lg"
            className="bg-accent-blue text-white hover:bg-accent-blue/90"
          >
            <Link href="/sign-up">Create an account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-text-dim">
        splitsmart
      </div>
    </footer>
  );
}
