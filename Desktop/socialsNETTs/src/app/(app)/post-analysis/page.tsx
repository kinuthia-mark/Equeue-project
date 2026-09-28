"use client";

import { useEffect, useState } from "react";
import { Link2, Sparkles, ArrowUp, Megaphone, Wrench } from "lucide-react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/misc";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Donut } from "@/components/charts/Charts";
import { analyzePost } from "@/lib/api";
import type { PostAnalysis } from "@/lib/types";

const recoIcon = { amplify: ArrowUp, engage: Sparkles, future: Wrench };
const DEFAULT_URL = "https://x.com/tech_maren/status/1834500000000000000";

export default function PostAnalysisPage() {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<PostAnalysis | null>(null);

  async function run() {
    setLoading(true);
    setR(null);
    const res = await analyzePost(url);
    setR(res);
    setLoading(false);
  }

  useEffect(() => { run(); }, []);

  return (
    <PageContainer className="flex flex-col gap-4">
      <Card className="flex items-center gap-2.5 p-[6px_6px_6px_15px]">
        <Link2 className="h-4 w-4 text-[var(--color-faint)]" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          className="mono h-[34px] flex-1 bg-transparent text-[13.5px] outline-none"
        />
        <button onClick={run} className="flex items-center gap-1.5 rounded-[9px] bg-[var(--color-primary)] px-[18px] py-2 text-[13px] font-medium text-white">
          <Sparkles className="h-4 w-4" /> Analyze
        </button>
      </Card>

      {loading || !r ? (
        <Card className="flex items-center justify-center py-20"><Spinner className="h-7 w-7" /></Card>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[380px_1fr]">
          {/* preview + performance */}
          <div className="flex flex-col gap-3.5">
            <Card className="p-[18px]">
              <div className="mb-3 flex items-center gap-[11px]">
                <Avatar initials={r.author.initials} color={r.author.color} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5"><span className="text-[14px] font-semibold">{r.author.name}</span>{r.author.verified && <span className="text-[12px] text-[var(--color-info)]">✓</span>}</div>
                  <div className="mono text-[11px] text-[var(--color-faint)]">{r.author.handle} · X</div>
                </div>
                <PlatformIcon platform={r.platform} />
              </div>
              <p className="mb-3.5 text-[15px] leading-[1.55]">{r.content}</p>
              <div className="mono flex gap-[18px] border-t border-[var(--color-border)] pt-3.5 text-[12px] text-[var(--color-muted)]">
                <span>♥ {r.performance[0].value}</span><span>💬 {r.performance[1].value}</span><span>↻ {r.performance[2].value}</span>
              </div>
            </Card>
            <Card className="p-[16px_18px]">
              <div className="mb-3.5 text-[13px] font-semibold">Performance breakdown</div>
              <div className="grid grid-cols-2 gap-3">
                {r.performance.map((p) => (
                  <div key={p.label}>
                    <div className="mb-1.5 text-[11px] text-[var(--color-faint)]">{p.label}</div>
                    <div className="mono text-[19px] font-semibold">{p.value}</div>
                    <div className="mono mt-0.5 text-[10px] text-[var(--color-positive)]">{p.sub}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* analysis */}
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[230px_1fr]">
              <Card className="flex flex-col items-center p-[16px_18px]">
                <div className="mb-1.5 self-start text-[13px] font-semibold">Sentiment</div>
                <div className="w-[130px]">
                  <Donut height={130} centerValue={`${r.sentiment.positive}%`} centerLabel="positive" data={[
                    { name: "Positive", value: r.sentiment.positive, color: "#22c55e" },
                    { name: "Neutral", value: r.sentiment.neutral, color: "#6b7280" },
                    { name: "Negative", value: r.sentiment.negative, color: "#ef4444" },
                  ]} />
                </div>
                <div className="mt-1 text-[11px] text-[var(--color-muted)]">Emotional tone: <span className="text-[var(--color-positive)]">{r.sentiment.tone}</span></div>
              </Card>
              <Card className="p-[16px_18px]">
                <div className="mb-3.5 text-[13px] font-semibold">Content evaluation</div>
                <div className="space-y-3">
                  {r.scores.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1.5 flex justify-between text-[12px]"><span className="text-[var(--color-muted)]">{s.label}</span><span className="mono text-[var(--color-positive)]">{s.value}</span></div>
                      <div className="h-1.5 rounded bg-[var(--color-track)]"><div className="h-full rounded bg-[var(--color-positive)]" style={{ width: `${s.value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Card className="p-[16px_18px]">
                <div className="mb-3 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-positive)]" /><span className="text-[12.5px] font-semibold">Positive indicators</span></div>
                <div className="space-y-2.5">{r.positives.map((p) => <div key={p} className="flex gap-2 text-[12.5px] text-[var(--color-muted)]"><span className="text-[var(--color-positive)]">+</span>{p}</div>)}</div>
              </Card>
              <Card className="p-[16px_18px]">
                <div className="mb-3 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-critical)]" /><span className="text-[12.5px] font-semibold">Risk indicators</span></div>
                <div className="space-y-2.5">{r.risks.map((p) => <div key={p} className="flex gap-2 text-[12.5px] text-[var(--color-faint)]"><span>—</span>{p}</div>)}</div>
              </Card>
            </div>

            <Card className="p-[16px_18px]">
              <div className="mb-3.5 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--color-primary-ink)]" /><span className="text-[13px] font-semibold">AI recommendations</span></div>
              <div className="space-y-2.5">
                {r.recommendations.map((rec) => {
                  const Icon = recoIcon[rec.icon];
                  return (
                    <div key={rec.title} className="flex gap-3.5 rounded-[11px] border border-[var(--color-border)] bg-[var(--color-canvas)] p-[13px]">
                      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-[var(--color-track)] text-[var(--color-primary-ink)]"><Icon className="h-4 w-4" /></span>
                      <div><div className="mb-0.5 text-[13px] font-medium">{rec.title}</div><div className="text-[12px] leading-[1.45] text-[var(--color-muted)]">{rec.desc}</div></div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
