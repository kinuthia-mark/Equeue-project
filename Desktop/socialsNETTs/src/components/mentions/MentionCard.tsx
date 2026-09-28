"use client";

import type { Mention } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { SentimentBadge } from "@/components/ui/Badge";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { cn } from "@/lib/utils";

const priorityDot: Record<string, string> = {
  critical: "bg-[var(--color-critical)]",
  high: "bg-[var(--color-critical)]",
  medium: "bg-[var(--color-warning)]",
  low: "bg-[var(--color-neutral)]",
};

export function MentionCard({ mention: m, onClick, selected }: { mention: Mention; onClick?: () => void; selected?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full border-b border-l-[3px] border-[var(--color-border)] px-[15px] py-[13px] text-left transition-colors",
        selected ? "border-l-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "border-l-transparent hover:bg-[var(--color-subtle)]",
      )}
    >
      <div className="mb-[7px] flex items-center gap-2.5">
        <div className="relative">
          <Avatar initials={m.author.initials} color={m.author.color} size="sm" />
          <span className="absolute -bottom-1 -right-1 rounded-full bg-[var(--color-surface)] p-[1px]">
            <PlatformIcon platform={m.platform} className="h-3 w-3" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-medium">{m.author.name}</span>
            {m.author.verified && <span className="text-[11px] text-[var(--color-info)]">✓</span>}
          </div>
          <p className="mono text-[10px] text-[var(--color-faint)]">{m.author.handle} · {m.time}</p>
        </div>
        <span className={cn("h-[7px] w-[7px] shrink-0 rounded-full", priorityDot[m.priority])} />
      </div>

      <p className="line-clamp-2 text-[12.5px] leading-[1.45] text-[var(--color-muted)]">{m.content}</p>

      <div className="mt-2.5 flex items-center gap-[11px]">
        <SentimentBadge value={m.sentiment} />
        <span className="mono text-[10px] text-[var(--color-faint)]">♥ {m.likes}</span>
        <span className="mono text-[10px] text-[var(--color-faint)]">↗ {m.reach}</span>
        {m.assignee && <span className="mono ml-auto text-[10px] text-[var(--color-faint)]">→ {m.assignee}</span>}
      </div>
    </button>
  );
}
