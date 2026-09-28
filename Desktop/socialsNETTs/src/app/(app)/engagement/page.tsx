"use client";

import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/misc";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { AreaTrend, PALETTE } from "@/components/charts/Charts";
import { useEngagementSeries } from "@/lib/queries";
import { downloadCsv } from "@/lib/csv";
import type { Platform } from "@/lib/types";

const KPIS = [
  { label: "Total engagements", value: "2.34M", delta: "+14.2%", c: "var(--color-positive)" },
  { label: "Engagement rate", value: "4.8%", delta: "+0.6pt", c: "var(--color-positive)" },
  { label: "Avg. response time", value: "1h 12m", delta: "−18m", c: "var(--color-positive)" },
  { label: "Click-through rate", value: "2.1%", delta: "+0.3pt", c: "var(--color-positive)" },
];

const TYPES = [
  { k: "Likes", v: "1.42M", pct: 100, color: "#6366f1" },
  { k: "Comments", v: "312K", pct: 44, color: "#a855f7" },
  { k: "Shares", v: "248K", pct: 35, color: "#22d3ee" },
  { k: "Saves", v: "196K", pct: 28, color: "#22c55e" },
  { k: "Retweets", v: "164K", pct: 23, color: "#f59e0b" },
];

const TOP: { platform: Platform; text: string; author: string; eng: string; rate: string }[] = [
  { platform: "tiktok", text: "the Vela morning routine that actually changed my energy levels", author: "@sarah.k.wellness · TikTok", eng: "28.5K", rate: "11.2%" },
  { platform: "twitter", text: "Vela Yuzu is genuinely the best drink I’ve had all year", author: "@tech_maren · X", eng: "15.3K", rate: "6.9%" },
  { platform: "instagram", text: "Vela restock just dropped — run don’t walk", author: "@glowwithava · Instagram", eng: "9.6K", rate: "5.1%" },
  { platform: "reddit", text: "Tried all 6 Vela flavors so you don’t have to — ranked", author: "r/beverages · Reddit", eng: "1.1K", rate: "3.2%" },
];

const RECS = [
  { title: "Reply within 40 minutes", desc: "Posts answered inside the viral window see 2.3x more downstream engagement." },
  { title: "Double down on TikTok", desc: "Your TikTok engagement rate (11.2%) is ~2x other platforms — shift creative there." },
];

export default function EngagementPage() {
  const series = useEngagementSeries();

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
          <div className="mb-2 flex items-center">
            <span className="text-[13px] font-semibold">Engagement timeline</span>
            <span className="mono ml-auto text-[11px] text-[var(--color-muted)]">interactions / day</span>
          </div>
          {series.data ? <AreaTrend height={210} data={series.data} series={[{ key: "interactions", color: PALETTE.primary, label: "Interactions" }]} /> : <Skeleton className="h-[210px]" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-4 text-[13px] font-semibold">Engagement by type</div>
          <div className="space-y-3.5">
            {TYPES.map((e) => (
              <div key={e.k}>
                <div className="mb-1.5 flex justify-between text-[12px]">
                  <span className="text-[var(--color-muted)]">{e.k}</span>
                  <span className="mono">{e.v}</span>
                </div>
                <div className="h-[7px] rounded bg-[var(--color-track)]"><div className="h-full rounded" style={{ width: `${e.pct}%`, background: e.color }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-[16px_18px]">
          <div className="mb-2 flex items-center">
            <span className="text-[13px] font-semibold">Top-performing content</span>
            <button
              onClick={() => downloadCsv("top-performing-content", TOP.map(({ platform, text, author, eng, rate }) => ({ platform, text, author, engagements: eng, rate })))}
              className="ml-auto text-[11px] text-[var(--color-primary-ink)] hover:underline"
            >
              Export
            </button>
          </div>
          {TOP.map((c, i) => (
            <div key={i} className="flex items-center gap-3 border-t border-[var(--color-border)] py-3 first:border-t-0">
              <PlatformIcon platform={c.platform} badge />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px]">{c.text}</div>
                <div className="mono mt-0.5 text-[10px] text-[var(--color-faint)]">{c.author}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="mono text-[13px] font-semibold">{c.eng}</div>
                <div className="mono text-[10px] text-[var(--color-positive)]">{c.rate} rate</div>
              </div>
            </div>
          ))}
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card className="p-[16px_18px]">
            <div className="mb-3.5 text-[13px] font-semibold">Community response rate</div>
            <div className="mb-2.5 flex items-end gap-2.5">
              <span className="mono text-[34px] font-semibold leading-none text-[var(--color-positive)]">87%</span>
              <span className="mb-[5px] text-[11px] text-[var(--color-faint)]">vs 72% industry</span>
            </div>
            <div className="relative mb-1.5 h-[7px] rounded bg-[var(--color-track)]">
              <div className="h-full rounded bg-[var(--color-positive)]" style={{ width: "87%" }} />
              <div className="absolute -top-[3px] h-[13px] w-0.5 bg-[var(--color-muted)]" style={{ left: "72%" }} />
            </div>
            <div className="text-[10px] text-[var(--color-faint)]">▲ benchmark · you’re outperforming by 15pt</div>
          </Card>
          <Card className="flex-1 p-[16px_18px]">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-primary-ink)]" />
              <span className="text-[13px] font-semibold">Recommendations</span>
            </div>
            <div className="space-y-[11px]">
              {RECS.map((r) => (
                <div key={r.title} className="flex gap-[11px]">
                  <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-[var(--color-track)] text-[var(--color-primary-ink)]">✦</span>
                  <div>
                    <div className="mb-0.5 text-[12.5px] font-medium">{r.title}</div>
                    <div className="text-[11.5px] leading-[1.45] text-[var(--color-muted)]">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
