export function WelcomeFooter() {
  return (
    <footer className="border-t border-(--text-dim)/30">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs font-semibold tracking-wide text-(--text-dim) sm:px-6">
        &copy; {new Date().getFullYear()} SplitSmart. All rights reserved.
      </div>
    </footer>
  );
}
