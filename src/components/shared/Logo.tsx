import { Divide } from "lucide-react";

export function Logo({ open }: { open: boolean }) {
  return (
    <div className="text-(--text-primary) flex justify-start items-center gap-3">
      <div
        className={`bg-(--accent-btn) flex justify-center items-center rounded-sm transition-all duration-300 ease-in-out shrink-0 ${
          open ? "w-12 h-10" : "w-[95%] h-10"
        }`}
      >
        <Divide className="transition-transform duration-300" />
      </div>

      <h1
        className={`text-3xl font-bold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "opacity-100 w-auto translate-x-0"
            : "opacity-0 w-0 -translate-x-4 pointer-events-none"
        }`}
      >
        Split<span className="text-(--accent-green)">Smart</span>
      </h1>
    </div>
  );
}
