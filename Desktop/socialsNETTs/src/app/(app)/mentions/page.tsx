"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MentionCard } from "@/components/mentions/MentionCard";
import { MentionDetail } from "@/components/mentions/MentionDetail";
import { Spinner } from "@/components/ui/misc";
import { useMentions, useUpdateMention } from "@/lib/queries";
import { downloadCsv } from "@/lib/csv";
import type { Mention } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHIPS = ["All", "Critical", "Unassigned", "Positive", "Negative", "Resolved"] as const;
type Chip = (typeof CHIPS)[number];

function timeToMinutes(t: string): number {
  const n = parseFloat(t);
  if (Number.isNaN(n)) return 0;
  if (t.includes("h")) return n * 60;
  if (t.includes("d")) return n * 60 * 24;
  return n;
}

export default function MentionsPage() {
  const { data } = useMentions();
  const updateMention = useUpdateMention();
  const [chip, setChip] = useState<Chip>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selId, setSelId] = useState<string | null>(null);

  const list = useMemo(() => {
    const base = (data ?? []).filter((m) => {
      switch (chip) {
        case "Critical": return m.priority === "critical";
        case "Unassigned": return !m.assignee;
        case "Positive": return m.sentiment === "positive";
        case "Negative": return m.sentiment === "negative";
        case "Resolved": return m.status === "resolved";
        default: return true;
      }
    });
    const q = search.trim().toLowerCase();
    const searched = q
      ? base.filter((m) => m.content.toLowerCase().includes(q) || m.author.name.toLowerCase().includes(q) || m.author.handle.toLowerCase().includes(q))
      : base;
    const sorted = [...searched].sort((a, b) => {
      const diff = timeToMinutes(a.time) - timeToMinutes(b.time);
      return sort === "newest" ? diff : -diff;
    });
    return sorted;
  }, [data, chip, search, sort]);

  const selected = list.find((m) => m.id === selId) ?? list[0];

  function resolve(id: string) {
    updateMention.mutate({ id, patch: { status: "resolved" } });
  }

  function exportList() {
    downloadCsv("mentions", list.map((m) => ({
      author: m.author.name, handle: m.author.handle, platform: m.platform, content: m.content,
      sentiment: m.sentiment, priority: m.priority, status: m.status, reach: m.reach, time: m.time,
    })));
  }

  return (
    <div className="flex h-[calc(100vh-54px)] flex-col">
      {/* filter bar */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[var(--color-border)] px-[22px] py-3">
        <div className="flex h-8 max-w-[300px] flex-1 items-center gap-2 rounded-[9px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-faint)] focus-within:border-[var(--color-border-strong)]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentions…"
            className="w-full bg-transparent text-[12px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-faint)]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChip(c)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12px]",
                chip === c
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto hidden gap-2 sm:flex">
          <select
            value={chip}
            onChange={(e) => setChip(e.target.value as Chip)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] text-[var(--color-muted)] outline-none"
          >
            {CHIPS.map((c) => <option key={c} value={c}>{c === "All" ? "Saved views" : c}</option>)}
          </select>
          <button onClick={exportList} className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]">Export</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* list */}
        <div className="w-full shrink-0 overflow-y-auto border-b border-[var(--color-border)] lg:w-[430px] lg:border-b-0 lg:border-r">
          <div className="sticky top-0 z-10 flex items-center border-b border-[var(--color-border)] bg-[var(--color-canvas)] px-[18px] py-[11px]">
            <span className="mono text-[11px] text-[var(--color-faint)]">{list.length} mentions</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
              className="ml-auto rounded-md border-none bg-transparent text-[11px] text-[var(--color-muted)] outline-none"
            >
              <option value="newest">Newest ▾</option>
              <option value="oldest">Oldest ▾</option>
            </select>
          </div>
          {data ? (
            list.map((m) => (
              <MentionCard key={m.id} mention={m} selected={selected?.id === m.id} onClick={() => setSelId(m.id)} />
            ))
          ) : (
            <div className="py-20"><Spinner className="mx-auto h-6 w-6" /></div>
          )}
        </div>

        {/* detail */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {selected ? <MentionDetail mention={selected} onResolve={resolve} /> : null}
        </div>
      </div>
    </div>
  );
}
