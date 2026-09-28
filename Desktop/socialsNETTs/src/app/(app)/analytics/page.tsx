"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/misc";
import { LineTrend, Sparkline, PALETTE } from "@/components/charts/Charts";
import { Heatmap } from "@/components/charts/Heatmap";
import {
  useMentionVolume, useSentimentBars, usePlatformComparison, useHashtags, useInfluencers,
} from "@/lib/queries";

const KPIS = [
  { label: "Mention volume", value: "48.2K", delta: "+12.4%", c: "var(--color-positive)" },
  { label: "Total reach", value: "12.4M", delta: "+8.1%", c: "var(--color-positive)" },
  { label: "Share of voice", value: "31%", delta: "+4pt", c: "var(--color-positive)" },
  { label: "Avg sentiment", value: "62%", delta: "−4pt", c: "var(--color-warning)" },
];

export default function AnalyticsPage() {
  const volume = useMentionVolume();
  const bars = useSentimentBars();
  const platforms = usePlatformComparison();
  const hashtags = useHashtags();
  const influencers = useInfluencers();

  return (
    <PageContainer className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.label} className="p-[14px_16px]">
            <div className="mb-2 text-[11px] text-[var(--color-muted)]">{k.label}</div>
            <div className="flex items-baseline gap-2.5">
              <span className="mono text-[23px] font-semibold tracking-[-0.02em]">{k.value}</span>
              <span className="mono text-[11px]" style={{ color: k.c }}>{k.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="flex flex-col p-[16px_18px]">
          <div className="mb-2 text-[13px] font-semibold">Mention volume trend</div>
          {volume.data ? <LineTrend height={210} data={volume.data} series={[{ key: "mentions", color: PALETTE.primary, label: "Mentions" }]} /> : <Skeleton className="h-[210px]" />}
        </Card>

        <Card className="flex flex-col p-[16px_18px]">
          <div className="mb-2 flex items-center">
            <span className="text-[13px] font-semibold">Sentiment distribution</span>
            <div className="ml-auto flex gap-2.5 text-[10px] text-[var(--color-muted)]">
              <Lg color="#22c55e" label="Pos" /><Lg color="#6b7280" label="Neu" /><Lg color="#ef4444" label="Neg" />
            </div>
          </div>
          {bars.data ? (
            <div className="flex min-h-[180px] flex-1 items-end gap-[5px] pt-2.5">
              {bars.data.map((b) => (
                <div key={b.week} className="flex h-full flex-1 flex-col justify-end overflow-hidden rounded-[3px]">
                  <div style={{ height: `${b.negative}%`, background: "#ef4444" }} />
                  <div style={{ height: `${b.neutral}%`, background: "#6b7280" }} />
                  <div style={{ height: `${b.positive}%`, background: "#22c55e" }} />
                </div>
              ))}
            </div>
          ) : <Skeleton className="h-[180px]" />}
          <div className="mono mt-1.5 flex justify-between text-[10px] text-[var(--color-faint)]"><span>W1</span><span>recall →</span><span>W14</span></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1fr_1.2fr]">
        <Card className="p-[16px_18px]">
          <div className="mb-3.5 flex items-center">
            <span className="text-[13px] font-semibold">Platform comparison</span>
            <div className="ml-auto flex gap-2.5 text-[10px] text-[var(--color-muted)]">
              <Lg color="#818cf8" label="Volume" /><Lg color="#34d399" label="Engagement" />
            </div>
          </div>
          {platforms.data ? (
            <div className="space-y-3.5">
              {platforms.data.map((p) => (
                <div key={p.platform} className="flex items-center gap-2.5">
                  <span className="w-20 text-[11px] text-[var(--color-muted)]">{p.platform}</span>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="h-[7px] rounded bg-[var(--color-track)]"><div className="h-full rounded" style={{ width: `${p.mentions}%`, background: "#818cf8" }} /></div>
                    <div className="h-[7px] rounded bg-[var(--color-track)]"><div className="h-full rounded" style={{ width: `${p.engagement}%`, background: "#34d399" }} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : <Skeleton className="h-40" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-3 text-[13px] font-semibold">Hashtag performance</div>
          <div className="mono grid grid-cols-[1.5fr_.8fr_.8fr_60px_50px] border-b border-[var(--color-border)] pb-2 text-[10px] text-[var(--color-faint)]">
            <span>HASHTAG</span><span className="text-right">VOL</span><span className="text-right">REACH</span><span className="text-right">CHG</span><span></span>
          </div>
          {hashtags.data ? hashtags.data.map((h) => (
            <div key={h.tag} className="grid grid-cols-[1.5fr_.8fr_.8fr_60px_50px] items-center border-b border-[var(--color-border)] py-2.5 last:border-0">
              <span className="text-[12.5px] font-medium text-[var(--color-primary-ink)]">{h.tag}</span>
              <span className="mono text-right text-[11px] text-[var(--color-muted)]">{h.vol}</span>
              <span className="mono text-right text-[11px] text-[var(--color-muted)]">{h.reach}</span>
              <span className="mono text-right text-[11px]" style={{ color: hex(h.intent) }}>{h.change}</span>
              <div className="ml-auto h-4 w-[50px]"><Sparkline data={h.spark} color={hex(h.intent)} height={16} /></div>
            </div>
          )) : <Skeleton className="mt-3 h-40" />}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-[16px_18px]">
          <div className="mb-3 flex items-center">
            <span className="text-[13px] font-semibold">Influencer impact</span>
            <Link href="/mentions" className="ml-auto text-[11px] text-[var(--color-primary-ink)] hover:underline">View all →</Link>
          </div>
          <div className="mono grid grid-cols-[1.6fr_.7fr_.8fr_1fr_56px] border-b border-[var(--color-border)] pb-2 text-[10px] text-[var(--color-faint)]">
            <span>CREATOR</span><span>PLAT</span><span className="text-right">REACH</span><span className="text-right">SENTIMENT</span><span className="text-right">SCORE</span>
          </div>
          {influencers.data ? influencers.data.map((i) => {
            const c = i.sentiment === "negative" ? "var(--color-critical)" : "var(--color-positive)";
            return (
              <div key={i.handle} className="grid grid-cols-[1.6fr_.7fr_.8fr_1fr_56px] items-center border-b border-[var(--color-border)] py-[11px] last:border-0">
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[12.5px] font-medium">{i.name}</div>
                  <div className="mono text-[10px] text-[var(--color-faint)]">{i.handle}</div>
                </div>
                <span className="text-[11px] text-[var(--color-muted)]">{i.platform}</span>
                <span className="mono text-right text-[11px] text-[var(--color-muted)]">{i.reach}</span>
                <span className="text-right text-[11px] capitalize" style={{ color: c }}>{i.sentiment}</span>
                <span className="mono text-right text-[13px] font-semibold" style={{ color: c }}>{i.score}</span>
              </div>
            );
          }) : <Skeleton className="mt-3 h-40" />}
        </Card>

        <Card className="flex flex-col p-[16px_18px]">
          <div className="mb-3 flex items-center">
            <span className="text-[13px] font-semibold">Activity heatmap</span>
            <span className="mono ml-auto text-[10px] text-[var(--color-faint)]">mentions · hour × day</span>
          </div>
          <Heatmap />
        </Card>
      </div>
    </PageContainer>
  );
}

function Lg({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1"><span className="h-[7px] w-[7px] rounded-sm" style={{ background: color }} />{label}</span>;
}
function hex(intent: string) {
  return ({ positive: PALETTE.positive, warning: PALETTE.warning, critical: PALETTE.critical } as Record<string, string>)[intent] ?? PALETTE.neutral;
}
