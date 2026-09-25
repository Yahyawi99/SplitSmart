import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Hero({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] md:items-center md:py-20">
      
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">
          Shared expenses, settled simply
        </p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-(--text-primary) sm:text-5xl">
          See who owes what, and the fastest way to fix it.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-(--text-secondary)">
          Log shared expenses, split them the way your group agreed, and let
          SplitSmart work out the smallest number of payments to settle everyone
          up.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {isSignedIn ? (
            <Button
              size="lg"
              className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)"
            >
              <Link href="/groups">Go to your groups</Link>
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                className="border-(--text-dim)/50 bg-transparent text-(--text-primary) hover:opacity-75 cursor-pointer"
              >
                <Link href="/app?guest=1">Continue as guest</Link>
              </Button>

              <Button
                size="lg"
                className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover) cursor-pointer"
              >
                <Link href="/sign-up">Create an account</Link>
              </Button>
            </>
          )}
        </div>

        {!isSignedIn && (
          <p className="mt-4 text-sm text-(--text-dim)">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-(--accent-btn) underline underline-offset-4 hover:text-(--accent-btn)/75"
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

function LedgerVisual() {
  return (
    <div className="rounded-xl border border-(--text-dim)/50 bg-(--bg-sidebar) p-5 shadow-2xl shadow-black/10 sm:p-6">
      <div className="flex items-center justify-between border-b border-(--text-dim)/30 pb-4">
        <div>
          <p className="text-2xl font-semibold text-(--text-primary)">
            Trip to Japan
          </p>
          <p className="mt-1 text-xs text-(--text-dim)">4 members</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <LedgerRow
          name="Sam Rivera (You)"
          initials="SR"
          color="bg-pink-500"
          amount="216.47"
        />
        <LedgerRow
          name="Jordan Park"
          initials="JP"
          color="bg-amber-500"
          amount="-3.02"
        />
        <LedgerRow
          name="Taylor Kim"
          initials="TK"
          color="bg-teal-500"
          amount="-213.45"
        />
        <LedgerRow
          name="Alex Chen"
          initials="AC"
          color="bg-indigo-500"
          amount="0.00"
        />
      </div>

      <div className="my-5 border-t border-dashed border-(--text-dim)/40" />

      <p className="text-xs font-semibold uppercase tracking-wider text-(--text-dim)">
        Suggested settlement
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-(--accent-green)/20 bg-(--accent-green)/10 px-4 py-3">
          <ArrowRightLeft className="h-4 w-4 shrink-0 text-(--accent-green)" />
          <p className="text-sm text-(--text-primary)">
            Taylor Kim <span className="text-(--text-dim) mx-1">pays</span> Sam
            Rivera{" "}
            <span className="font-semibold text-(--accent-green)">$213.45</span>
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-(--accent-green)/20 bg-(--accent-green)/10 px-4 py-3">
          <ArrowRightLeft className="h-4 w-4 shrink-0 text-(--accent-green)" />
          <p className="text-sm text-(--text-primary)">
            Jordan Park <span className="text-(--text-dim) mx-1">pays</span> Sam
            Rivera{" "}
            <span className="font-semibold text-(--accent-green)">$3.02</span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-(--text-dim)">
        2 payments settle the whole group — the minimum possible.
      </p>
    </div>
  );
}

function LedgerRow({
  name,
  initials,
  color,
  amount,
}: {
  name: string;
  initials: string;
  color: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className={`h-7 w-7 ${color}`}>
          <AvatarFallback className="text-[10px] font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="text-(--text-secondary) font-semibold">{name}</p>
      </div>

      <p
        className={
          parseInt(amount) > 0
            ? "text-(--accent-green)"
            : parseInt(amount) < 0
              ? "text-(--accent-red)"
              : "text-(--text-dim)"
        }
      >
        {parseInt(amount) > 0
          ? "+$" + amount
          : parseInt(amount) < 0
            ? "-$" + Number(amount) * -1
            : "$" + amount}
      </p>
    </div>
  );
}
