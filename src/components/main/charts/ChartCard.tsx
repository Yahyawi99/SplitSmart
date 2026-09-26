"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  description?: string;
  fileName: string;
  data?: unknown;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  fileName,
  data = [],
  children,
}: ChartCardProps) {
  const [open, setOpen] = useState(false);

  function downloadData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card
      className={`w-full bg-(--bg-sidebar) text-(--text-primary) border border-(--text-dim)/50 ring-0 rounded-xl p-0 ${open || "h-fit"}`}
      onClick={() => setOpen((value) => !value)}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between gap-4  ${open ? "p-5 pb-1" : "p-5"} cursor-pointer rounded-0`}
      >
        <div className="min-w-0">
          <CardTitle className="truncate lg:text-xl">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-xs text-(--text-secondary)">
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {open && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={downloadData}
              aria-label={`Download ${title} data`}
              title="Download data"
            >
              <Download />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={open ? `Close ${title}` : `Open ${title}`}
            title={open ? "Close" : "Open"}
          >
            {open ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="border-t border-(--text-dim)/50 ">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
