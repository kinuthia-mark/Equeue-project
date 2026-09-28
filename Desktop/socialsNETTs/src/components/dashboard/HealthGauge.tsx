"use client";

import type { BrandHealth } from "@/lib/types";
import { cn } from "@/lib/utils";

const intentColor: Record<string, string> = {
  positive: "var(--color-positive)",
  warning: "var(--color-warning)",
  critical: "var(--color-critical)",
  info: "var(--color-info)",
  neutral: "var(--color-neutral)",
};

const dotClass: Record<string, string> = {
  positive: "bg-[var(--color-positive)]",
  warning: "bg-[var(--color-warning)]",
  critical: "bg-[var(--color-critical)]",
  info: "bg-[var(--color-info)]",
  neutral: "bg-[var(--color-neutral)]",
};

export function HealthGauge({ health }: { health: BrandHealth }) {
  const r = 84;
  const circ = 2 * Math.PI * r;
  const dash = (circ * health.score) / 100;

  return (
    <div className="card flex flex-col p-[18px]">
      <div className="mb-1.5 flex items-center">
        <span className="text-[12px] font-semibold">Brand Health Index</span>
        <span className="mono ml-auto rounded-md bg-[var(--color-warning-soft)] px-[7px] py-0.5 text-[10px] text-[var(--color-warning)]">
          {health.status}
        </span>
      </div>

      <div className="flex items-center justify-center py-2.5">
        <div className="relative h-[168px] w-[168px]">
          <svg viewBox="0 0 200 200" className="h-[168px] w-[168px] -rotate-90">
            <circle cx="100" cy="100" r={r} fill="none" stroke="var(--color-track)" strokeWidth="13" />
            <circle
              cx="100" cy="100" r={r} fill="none" stroke="url(#hg)" strokeWidth="13" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
            />
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#facc15" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="mono text-[42px] font-semibold tracking-[-0.03em]">{health.score}</span>
            <span className="text-[11px] text-[var(--color-warning)]">{health.deltaLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-1">
        <p className="mb-1.5 text-[11px] text-[var(--color-muted)]">What changed</p>
        {health.drivers.map((d) => (
          <div key={d.label} className="flex items-center gap-2.5 border-t border-[var(--color-border)] py-[7px]">
            <span className={cn("h-[7px] w-[7px] shrink-0 rounded-sm", dotClass[d.intent])} />
            <span className="flex-1 text-[12px] text-[var(--color-muted)]">{d.label}</span>
            <span className="mono text-[12px]" style={{ color: intentColor[d.intent] }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
