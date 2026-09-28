"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/misc";
import { SentimentBadge } from "@/components/ui/Badge";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { KpiCard, KpiCardSkeleton } from "@/components/dashboard/KpiCard";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { AreaTrend, Donut, PALETTE } from "@/components/charts/Charts";
import {
  useKpis, useBrandHealth, useMentionVolume, useSentiment,
  usePlatformBreakdown, useTrends, useLiveFeed, useAlerts,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const kpis = useKpis();
  const health = useBrandHealth();
  const volume = useMentionVolume();
  const sentiment = useSentiment();
  const platforms = usePlatformBreakdown();
  const trends = useTrends();
  const feed = useLiveFeed();
  const alerts = useAlerts();

  return (
    <PageContainer className="flex flex-col gap-3.5">
      {/* KPI rail */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.data ? kpis.data.map((k) => <KpiCard key={k.id} kpi={k} />) : Array.from({ length: 5 }).map((_, i) => <KpiCardSkeleton key={i} />)}
      </div>

      {/* Health + volume */}
      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[300px_1fr]">
        {health.data ? <HealthGauge health={health.data} /> : <Skeleton className="h-[420px] rounded-[14px]" />}

        <Card className="flex min-h-[300px] flex-col p-[16px_18px]">
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-semibold">Conversation volume</span>
            <span className="mono text-[12px] text-[var(--color-muted)]">48,210 mentions · 12.4M reach</span>
            <div className="ml-auto flex gap-3 text-[11px] text-[var(--color-muted)]">
              <Legend color={PALETTE.primary} label="Total" />
              <Legend color={PALETTE.critical} label="Negative" />
            </div>
          </div>
          {volume.data ? (
            <AreaTrend
              height={250}
              data={volume.data}
              series={[
                { key: "mentions", color: PALETTE.primary, label: "Total" },
                { key: "negative", color: PALETTE.critical, label: "Negative" },
              ]}
            />
          ) : <Skeleton className="h-[250px] w-full" />}
        </Card>
      </div>

      {/* Donut + platforms + trends */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
        <Card className="p-[16px_18px]">
          <div className="mb-2.5 text-[13px] font-semibold">Sentiment mix</div>
          {sentiment.data ? (
            <div className="flex items-center gap-4">
              <div className="w-[108px] shrink-0">
                <Donut height={108} data={sentiment.data} centerValue="62%" centerLabel="positive" />
              </div>
              <div className="flex-1 space-y-2.5">
                {sentiment.data.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="text-[var(--color-muted)]">{s.name}</span>
                      <span className="mono">{s.value}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--color-track)]">
                      <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: chartColor(s.color) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : <Skeleton className="h-[120px] w-full" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-3 text-[13px] font-semibold">By platform</div>
          {platforms.data ? (
            <div className="space-y-[11px]">
              {platforms.data.map((p) => (
                <div key={p.platform} className="flex items-center gap-2.5">
                  <span className="w-16 text-[11px] text-[var(--color-muted)]">{p.platform}</span>
                  <div className="h-1.5 flex-1 rounded bg-[var(--color-track)]">
                    <div className="h-full rounded" style={{ width: `${p.mentions}%`, background: p.color }} />
                  </div>
                  <span className="mono w-7 text-right text-[11px] text-[var(--color-muted)]">{p.mentions}%</span>
                </div>
              ))}
            </div>
          ) : <Skeleton className="h-[140px] w-full" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-3 flex items-center">
            <span className="text-[13px] font-semibold">Emerging trends</span>
            <Link href="/analytics" className="ml-auto text-[11px] text-[var(--color-primary-ink)]">View all →</Link>
          </div>
          {trends.data ? (
            <div className="space-y-[11px]">
              {trends.data.map((tr) => (
                <div key={tr.rank} className="flex items-center gap-2.5">
                  <span className="mono w-3.5 text-[10px] text-[var(--color-faint)]">{tr.rank}</span>
                  <span className="flex-1 truncate text-[12px]">{tr.term}</span>
                  <span className="mono text-[10px] text-[var(--color-faint)]">{tr.vol}</span>
                  <span className="mono w-12 text-right text-[11px]" style={{ color: intentHex(tr.intent) }}>{tr.change}</span>
                </div>
              ))}
            </div>
          ) : <Skeleton className="h-[140px] w-full" />}
        </Card>
      </div>

      {/* Live mentions + alerts */}
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-[16px_18px]">
          <div className="mb-2.5 flex items-center gap-3">
            <span className="text-[13px] font-semibold">Live mentions</span>
            <span className="mono ml-auto flex items-center gap-1.5 text-[10px] text-[var(--color-warning)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)] live-dot" /> 3.2K/hr
            </span>
            <Link href="/mentions" className="text-[11px] text-[var(--color-primary-ink)]">Open inbox →</Link>
          </div>
          {feed.data ? feed.data.map((f, i) => (
            <Link key={i} href="/mentions" className="flex items-center gap-3 border-t border-[var(--color-border)] py-2.5 first:border-t-0">
              <PlatformIcon platform={f.platform as never} badge />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px]">{f.text}</p>
                <p className="mono mt-0.5 text-[10px] text-[var(--color-faint)]">{f.meta}</p>
              </div>
              <SentimentBadge value={f.sentiment} />
            </Link>
          )) : <Skeleton className="h-40 w-full" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-2.5 flex items-center">
            <span className="text-[13px] font-semibold">Priority alerts</span>
            <span className="mono ml-auto rounded-full bg-[var(--color-critical-soft)] px-[7px] py-px text-[10px] text-[var(--color-critical)]">3 new</span>
          </div>
          {alerts.data ? alerts.data.slice(0, 3).map((a) => (
            <Link key={a.id} href="/crisis" className="flex items-start gap-2.5 border-t border-[var(--color-border)] py-2.5 first:border-t-0">
              <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full",
                a.severity === "critical" ? "bg-[var(--color-critical)]" : a.severity === "warning" ? "bg-[var(--color-warning)]" : "bg-[var(--color-info)]")} />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px]">{a.title}</p>
                <p className="mono mt-0.5 text-[10px] text-[var(--color-faint)]">{a.time} · {a.metric}</p>
              </div>
              <span className="text-[var(--color-faint)]">›</span>
            </Link>
          )) : <Skeleton className="h-40 w-full" />}
        </Card>
      </div>
    </PageContainer>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
function intentHex(intent: string) {
  return ({ positive: PALETTE.positive, warning: PALETTE.warning, critical: PALETTE.critical, info: PALETTE.primary, neutral: PALETTE.neutral } as Record<string, string>)[intent] ?? PALETTE.neutral;
}
function chartColor(token: string) {
  return ({ "var(--color-positive)": PALETTE.positive, "var(--color-neutral)": PALETTE.neutral, "var(--color-critical)": PALETTE.critical } as Record<string, string>)[token] ?? token;
}
