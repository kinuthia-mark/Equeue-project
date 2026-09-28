"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { SeriesPoint } from "@/lib/types";

// Hex mirror of the CSS tokens (SVG attrs don't resolve var() reliably).
export const PALETTE = {
  primary: "#5b58e6",
  positive: "#16a34a",
  warning: "#d98207",
  critical: "#dc2626",
  info: "#2563eb",
  neutral: "#94a3b8",
  pink: "#a855f7",
  teal: "#22d3ee",
  grid: "rgba(130,130,140,.16)",
  axis: "#86868f",
};
export const CHART_COLORS = [PALETTE.primary, PALETTE.positive, PALETTE.warning, PALETTE.info, PALETTE.pink, PALETTE.teal];

const axisProps = {
  tick: { fontSize: 11, fill: PALETTE.axis },
  tickLine: false,
  axisLine: false,
} as const;

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-[var(--shadow-pop)]">
      {label && <p className="mb-1 font-semibold text-[var(--color-ink)]">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[var(--color-muted)]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-medium text-[var(--color-ink)]">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AreaTrend({
  data,
  series,
  height = 260,
  showLegend = false,
}: {
  data: SeriesPoint[];
  series: { key: string; color: string; label?: string }[];
  height?: number;
  showLegend?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis dataKey="date" {...axisProps} minTickGap={24} />
        <YAxis {...axisProps} width={44} />
        <Tooltip content={<TooltipBox />} />
        {showLegend && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#g-${s.key})`}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineTrend({
  data,
  series,
  height = 260,
}: {
  data: SeriesPoint[];
  series: { key: string; color: string; label?: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETTE.grid} />
        <XAxis dataKey="date" {...axisProps} minTickGap={24} />
        <YAxis {...axisProps} width={44} />
        <Tooltip content={<TooltipBox />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Bars({
  data,
  xKey,
  bars,
  height = 260,
  layout = "horizontal",
}: {
  data: any[];
  xKey: string;
  bars: { key: string; color: string; label?: string }[];
  height?: number;
  layout?: "horizontal" | "vertical";
}) {
  const vertical = layout === "vertical";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{ top: 6, right: 8, left: vertical ? 8 : -18, bottom: 0 }}
      >
        <CartesianGrid horizontal={!vertical} vertical={vertical} stroke={PALETTE.grid} />
        {vertical ? (
          <>
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey={xKey} {...axisProps} width={110} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps} minTickGap={16} />
            <YAxis {...axisProps} width={44} />
          </>
        )}
        <Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label ?? b.key} fill={b.color} radius={vertical ? [0, 5, 5, 0] : [5, 5, 0, 0]} maxBarSize={vertical ? 18 : 42} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  height = 220,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color.startsWith("var") ? cssVar(d.color) : d.color} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
        </PieChart>
      </ResponsiveContainer>
      {(centerValue || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="text-2xl font-bold">{centerValue}</span>}
          {centerLabel && <span className="text-xs text-[var(--color-muted)]">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

// Resolve a token like var(--color-positive) to its hex for SVG fills.
function cssVar(v: string): string {
  const map: Record<string, string> = {
    "var(--color-positive)": PALETTE.positive,
    "var(--color-neutral)": PALETTE.neutral,
    "var(--color-critical)": PALETTE.critical,
    "var(--color-primary)": PALETTE.primary,
    "var(--color-info)": PALETTE.info,
    "var(--color-warning)": PALETTE.warning,
  };
  return map[v] ?? v;
}

export function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={d} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sp-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} fill={`url(#sp-${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
