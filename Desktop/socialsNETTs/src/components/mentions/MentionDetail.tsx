"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RotateCw } from "lucide-react";
import type { Mention } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon, platformLabel } from "@/components/ui/PlatformIcon";
import { useAddCrisisEvent, useAddMentionNote, useCrises, useReplyToMention, useTeam, useUpdateMention } from "@/lib/queries";
import { cn } from "@/lib/utils";

const priorityColor: Record<string, string> = {
  critical: "var(--color-critical)",
  high: "var(--color-critical)",
  medium: "var(--color-warning)",
  low: "var(--color-neutral)",
};

export function MentionDetail({ mention: m, onResolve }: { mention: Mention; onResolve: (id: string) => void }) {
  const [reply, setReply] = useState(m.suggestedReply);
  const [sent, setSent] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const team = useTeam();
  const crises = useCrises();
  const replyMutation = useReplyToMention();
  const noteMutation = useAddMentionNote();
  const updateMention = useUpdateMention();
  const addCrisisEvent = useAddCrisisEvent();

  function useAndReply() {
    if (!reply.trim()) return;
    replyMutation.mutate({ id: m.id, text: reply }, { onSuccess: () => setSent(true) });
  }

  function regenerate() {
    setReply(m.suggestedReply);
  }

  function assignTo(name: string) {
    updateMention.mutate({ id: m.id, patch: { assignee: name } });
    setAssignOpen(false);
  }

  function submitNote() {
    if (!noteText.trim()) return;
    noteMutation.mutate({ id: m.id, text: noteText.trim() }, { onSuccess: () => { setNoteText(""); setNoteOpen(false); } });
  }

  function escalateToCrisis() {
    const crisis = crises.data?.[0];
    if (!crisis) return;
    addCrisisEvent.mutate({
      id: crisis.id,
      event: {
        title: "Mention escalated",
        detail: `${m.author.name} (${m.author.handle}): "${m.content.slice(0, 80)}${m.content.length > 80 ? "…" : ""}"`,
        dot: "#ef4444",
        tag: "Ochiengs Moses",
        tagIntent: "critical",
      },
    });
    router.push("/crisis");
  }

  return (
    <div className="mx-auto max-w-[720px] p-[22px_26px]">
      {/* header */}
      <div className="mb-[18px] flex items-start gap-3">
        <Avatar initials={m.author.initials} color={m.author.color} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-[7px]">
            <span className="text-[16px] font-semibold">{m.author.name}</span>
            {m.author.verified && <span className="text-[var(--color-info)]">✓</span>}
            <span className="mono text-[11px] text-[var(--color-faint)]">{m.author.handle}</span>
          </div>
          <p className="mono mt-0.5 text-[11px] text-[var(--color-faint)]">
            {platformLabel(m.platform)} · {m.time} ago · {m.author.followers} followers
          </p>
        </div>
        <span
          className="rounded-[7px] border px-2.5 py-1 text-[11px] capitalize"
          style={{ color: priorityColor[m.priority], borderColor: priorityColor[m.priority] }}
        >
          {m.priority} priority
        </span>
      </div>

      {/* content */}
      <p className="mb-[18px] text-[16px] leading-[1.6]">{m.content}</p>

      {/* engagement */}
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { l: "Likes", v: m.likes }, { l: "Comments", v: m.comments },
          { l: "Shares", v: m.shares }, { l: "Reach", v: m.reach },
        ].map((x) => (
          <div key={x.l} className="card p-[13px_14px]">
            <div className="mb-1 text-[11px] text-[var(--color-faint)]">{x.l}</div>
            <div className="mono text-[18px] font-semibold">{x.v}</div>
          </div>
        ))}
      </div>

      {/* AI analysis */}
      <div className="card mb-4 p-[18px]">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary-ink)]" />
          <span className="text-[13px] font-semibold">AI sentiment analysis</span>
          <span className="mono ml-auto text-[10px] text-[var(--color-faint)]">{m.confidence}% confidence</span>
        </div>
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          <div>
            <p className="mb-[11px] text-[11px] text-[var(--color-faint)]">Emotional tone</p>
            <div className="space-y-2.5">
              {m.emotions.map((e) => (
                <div key={e.k}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-[var(--color-muted)]">{e.k}</span>
                    <span className="mono text-[var(--color-faint)]">{e.v}%</span>
                  </div>
                  <div className="h-[5px] rounded bg-[var(--color-track)]">
                    <div className="h-full rounded bg-[var(--color-info)]" style={{ width: `${e.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-[11px] text-[11px] text-[var(--color-faint)]">Key topics</p>
            <div className="flex flex-wrap gap-[7px]">
              {m.topics.map((t) => (
                <span key={t} className="rounded-[7px] bg-[var(--color-track)] px-[11px] py-[5px] text-[12px] text-[var(--color-muted)]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* notes */}
      {m.notes && m.notes.length > 0 && (
        <div className="card mb-4 p-[18px]">
          <div className="mb-3 text-[13px] font-semibold">Notes</div>
          <div className="space-y-2.5">
            {m.notes.map((n, i) => (
              <div key={i} className="text-[12.5px]">
                <span className="font-medium">{n.author}</span>
                <span className="ml-2 text-[10px] text-[var(--color-faint)]">{n.at}</span>
                <p className="mt-0.5 text-[var(--color-muted)]">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* suggested response */}
      <div className="card mb-[18px] p-[18px]">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary-ink)]" />
          <span className="text-[13px] font-semibold">Suggested response</span>
          <button onClick={regenerate} className="mono ml-auto flex items-center gap-1 text-[11px] text-[var(--color-primary-ink)]">
            <RotateCw className="h-3 w-3" /> Regenerate
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={reply}
          onChange={(e) => { setReply(e.target.value); setSent(false); }}
          rows={3}
          className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-canvas)] p-3.5 text-[14px] leading-[1.6] outline-none ring-focus"
        />
        <div className="mt-3 flex items-center gap-2.5">
          <button
            onClick={useAndReply}
            disabled={!reply.trim() || replyMutation.isPending}
            className="rounded-[9px] bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            Use &amp; reply
          </button>
          <button
            onClick={() => textareaRef.current?.focus()}
            className="rounded-[9px] border border-[var(--color-border)] px-4 py-2 text-[13px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]"
          >
            Edit
          </button>
          {sent && <span className="text-[11px] text-[var(--color-positive)]">Sent ✓</span>}
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-start gap-2.5">
        <div className="relative">
          <button onClick={() => setAssignOpen((v) => !v)} className="rounded-[9px] border border-[var(--color-border)] px-3.5 py-2 text-[12.5px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]">
            {m.assignee ? `Assigned: ${m.assignee}` : "Assign →"}
          </button>
          {assignOpen && (
            <div className="card absolute left-0 top-[calc(100%+6px)] z-10 w-48 p-1.5">
              {(team.data ?? []).map((t) => (
                <button key={t.id} onClick={() => assignTo(t.name)} className="block w-full rounded-md px-2.5 py-1.5 text-left text-[12px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)] hover:text-[var(--color-ink)]">
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setNoteOpen((v) => !v)} className="rounded-[9px] border border-[var(--color-border)] px-3.5 py-2 text-[12.5px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]">
            Add note
          </button>
          {noteOpen && (
            <div className="card absolute left-0 top-[calc(100%+6px)] z-10 w-72 p-2.5">
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="Add an internal note…"
                className="w-full resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-canvas)] p-2 text-[12px] outline-none ring-focus"
              />
              <button onClick={submitNote} disabled={!noteText.trim() || noteMutation.isPending} className="mt-2 w-full rounded-md bg-[var(--color-primary)] py-1.5 text-[12px] font-medium text-white disabled:opacity-50">Save note</button>
            </div>
          )}
        </div>

        <button onClick={escalateToCrisis} disabled={addCrisisEvent.isPending} className="rounded-[9px] border border-[rgba(239,68,68,.35)] px-3.5 py-2 text-[12.5px] text-[var(--color-critical)] hover:bg-[var(--color-critical-soft)] disabled:opacity-50">
          Escalate to Crisis
        </button>

        <button
          onClick={() => onResolve(m.id)}
          disabled={m.status === "resolved"}
          className={cn(
            "ml-auto rounded-[9px] border px-3.5 py-2 text-[12.5px]",
            m.status === "resolved"
              ? "border-[var(--color-border)] text-[var(--color-faint)]"
              : "border-[rgba(34,197,94,.4)] text-[var(--color-positive)] hover:bg-[var(--color-positive-soft)]",
          )}
        >
          ✓ {m.status === "resolved" ? "Resolved" : "Mark resolved"}
        </button>
      </div>
    </div>
  );
}
