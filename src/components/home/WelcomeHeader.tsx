import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeMenu } from "./ThemeMenu";
import { Logo } from "../shared";

export function WelcomeHeader({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-(--text-dim)/40 bg-(--bg-sidebar)/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/">
          <Logo open={true} />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-(--text-secondary) md:flex">
          <a
            href="#how-it-works"
            className="transition-colors hover:text-(--text-primary)"
          >
            How it works
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-(--text-primary)"
          >
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex">
            {isSignedIn ? (
              <Button className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)/75">
                <Link href="/groups">Go to your groups</Link>
              </Button>
            ) : (
              <div>
                <Link
                  href="/sign-in"
                  className="text-sm text-(--accent-btn) hover:text-(--accent-btn)/75 font-bold"
                >
                  Sign in
                </Link>

                <Button className="bg-(--accent-btn) text-white hover:bg-(--accent-btn-hover)/75 ml-2">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
