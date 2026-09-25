import Link from "next/link";
import { Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "./ThemeMenu";

export function WelcomeHeader({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-(--text-dim)/40 bg-(--bg-sidebar)/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-(--text-primary)">
          <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-sm bg-(--accent-btn)">
            <Divide className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold tracking-tight">SplitSmart</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-(--text-secondary) md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-(--text-primary)">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-(--text-primary)">
            Features
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Button  className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)">
              <Link href="/groups">Go to your groups</Link>
            </Button>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-(--text-secondary) hover:text-(--text-primary)">
                Sign in
              </Link>
              <Button  className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
