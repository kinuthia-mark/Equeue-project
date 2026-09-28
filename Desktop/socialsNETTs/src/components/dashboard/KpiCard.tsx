"use client";

import type { Kpi, Intent } from "@/lib/types";
import { Sparkline, PALETTE } from "@/components/charts/Charts";
import { Skeleton } from "@/components/ui/misc";

const intentHex: Record<Intent, string> = {
  positive: PALETTE.positive,
  warning: PALETTE.warning,
  critical: PALETTE.critical,
  info: PALETTE.primary,
  neutral: PALETTE.neutral,
};

const intentText: Record<Intent, string> = {
  positive: "text-[var(--color-positive)]",
  warning: "text-[var(--color-warning)]",
  critical: "text-[var(--color-critical)]",
  info: "text-[var(--color-info)]",
  neutral: "text-[var(--color-muted)]",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const color = intentHex[kpi.intent];
  return (
    <div className="card relative overflow-hidden p-[13px_15px]">
      <div className="text-[11px] text-[var(--color-muted)]">{kpi.label}</div>
      <div className="mono mt-2 text-[23px] font-semibold leading-none tracking-[-0.02em]">{kpi.value}</div>
      <div className="mt-[7px] flex items-center gap-1.5">
        <span className={`mono text-[11px] font-medium ${intentText[kpi.intent]}`}>{kpi.delta}</span>
        <span className="text-[10px] text-[var(--color-faint)]">vs prev</span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 h-[22px] w-[62px] opacity-85">
        <Sparkline data={kpi.spark} color={color} />
      </div>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="card flex flex-col gap-2.5 p-[13px_15px]">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
