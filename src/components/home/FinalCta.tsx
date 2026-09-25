import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            className="border-(--text-dim)/50 bg-transparent text-(--text-primary) hover:opacity-75"
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
