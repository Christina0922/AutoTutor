import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  tone?: Tone;
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, subtitle, tone = "primary", icon }: KpiCardProps) {
  const strip =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
      ? "bg-warning"
      : tone === "danger"
      ? "bg-danger"
      : "bg-primary";

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className={cn("h-1", strip)} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
            {subtitle ? (
              <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
            ) : null}
          </div>
          {icon ? (
            <div className="rounded-xl border bg-secondary/50 p-2 text-muted-foreground">
              {icon}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
