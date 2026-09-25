

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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-blue)">
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
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-blue)/10 text-sm font-bold text-(--accent-blue)">
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
