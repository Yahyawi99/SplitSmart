"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
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
    <Card className="w-full bg-(--bg-sidebar) text-(--text-primary)">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-(--text-dim)/30">
        <div className="min-w-0">
          <CardTitle className="truncate">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-xs text-(--text-secondary)">
              {description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? `Close ${title}` : `Open ${title}`}
            title={open ? "Close" : "Open"}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
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
        </div>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}
