"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ChartCard from "./ChartCard";

type TimeRange = "day" | "week" | "month";

interface SpendingOverTimeChartProps {
  data?: unknown;
}

export default function SpendingOverTimeChart({
  data = [],
}: Partial<SpendingOverTimeChartProps>) {
  const [range, setRange] = useState<TimeRange>("week");

  return (
    <ChartCard
      title="Spending Over Time"
      description="Track spending across the selected period."
      fileName={`spending-over-time-${range}`}
      data={data}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-(--text-dim)/50 p-1">
          {(["day", "week", "month"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRange(option)}
              className={`capitalize ${
                range === option
                  ? "bg-(--accent-btn)/25 text-(--accent-btn)"
                  : ""
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex min-h-56 items-center justify-center rounded-lg border border-dashed border-(--text-dim)/50 text-sm text-(--text-secondary)">
        Chart coming soon for {range}
      </div>
    </ChartCard>
  );
}
