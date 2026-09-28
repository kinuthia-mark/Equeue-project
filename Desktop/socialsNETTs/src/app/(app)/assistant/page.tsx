"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, MessageSquare, ArrowUp } from "lucide-react";
import { Spinner } from "@/components/ui/misc";
import { askAssistant } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ChatMessage, Intent } from "@/lib/types";

const cardColor: Record<Intent, string> = {
  positive: "var(--color-positive)", warning: "var(--color-warning)",
  critical: "var(--color-critical)", info: "var(--color-info)", neutral: "var(--color-muted)",
};

// Seed conversation + UI copy for the assistant panel — static chrome, not
// backend data (the actual replies come from askAssistant -> Django).
const suggestedPrompts = [
  "Summarize audience sentiment for the last campaign.",
  "Which influencers are driving engagement?",
  "Identify emerging risks for our brand.",
  "Suggest strategies to improve engagement.",
];

const initialChat: ChatMessage[] = [
  {
    id: "w1", role: "user",
    content: "What caused the spike in negative mentions yesterday?",
  },
  {
    id: "w2", role: "assistant",
    content:
      "Negative mentions rose +218% in 6 hours yesterday, driven almost entirely by an unverified product-recall rumor. It originated in a single Reddit thread on r/skincareaddiction at 14:20 UTC, then amplified onto X via three mid-size accounts. Sentiment recovered partially after your team’s holding statement, but the conversation is still active.",
    cards: [
      { t: "Negative mentions", v: "+218%", s: "6h window", intent: "critical" },
      { t: "Origin", v: "r/skincareaddiction", s: "1 thread → 2.4k upvotes", intent: "warning" },
      { t: "Reach exposed", v: "2.8M", s: "before mitigation", intent: "warning" },
    ],
    sources: ["Reddit · r/skincareaddiction", "X · @dailyhealthnut", "News · TechWire"],
    action: { label: "Open Crisis Center", href: "/crisis" },
  },
];

// Additional canned past conversations for the RECENT sidebar — demo chat
// history, same treatment as suggestedPrompts/initialChat above.
const chatArchive: Record<string, ChatMessage[]> = {
  "Negative spike investigation": initialChat,
  "#VelaGlow campaign recap": [
    { id: "c1_u", role: "user", content: "Summarize audience sentiment for the last campaign." },
    {
      id: "c1_a", role: "assistant",
      content: "The #VelaGlow campaign netted 62% positive / 24% neutral / 14% negative across 48.2K mentions. Positivity clustered around the Yuzu flavor and the Maren collab; the negative slice is almost entirely the recall rumor, not campaign fatigue.",
      cards: [
        { t: "Net sentiment", v: "+48", s: "pos minus neg", intent: "positive" },
        { t: "Top driver", v: "Yuzu flavor", s: "8.4k mentions", intent: "positive" },
      ],
      sources: ["Analytics · Campaign view", "Mentions · #VelaGlow"],
    },
  ],
  "Competitor share of voice": [
    { id: "c2_u", role: "user", content: "How does our share of voice compare to competitors this month?" },
    {
      id: "c2_a", role: "assistant",
      content: "Vela holds 31% share of voice in the adaptogen-beverage category this month, up 4pt — driven by the #VelaGlow campaign and the Maren Cole collab. The recall rumor briefly closed the gap with the #2 competitor, but share recovered after the holding statement.",
      cards: [
        { t: "Share of voice", v: "31%", s: "+4pt MoM", intent: "positive" },
        { t: "Nearest rival", v: "22%", s: "flat MoM", intent: "neutral" },
      ],
      sources: ["Analytics · Platform comparison"],
    },
  ],
  "Q2 influencer shortlist": [
    { id: "c3_u", role: "user", content: "Which influencers are driving engagement?" },
    {
      id: "c3_a", role: "assistant",
      content: "Three accounts drove 41% of campaign reach. @tech_maren (418K) is your strongest advocate this week with a 2.1M-reach post. @sarah.k.wellness delivered the highest engagement rate at 11.2%. Watch @dailyhealthnut — large reach but currently negative on sugar content.",
      cards: [
        { t: "@tech_maren", v: "2.1M", s: "reach · positive", intent: "positive" },
        { t: "@sarah.k.wellness", v: "11.2%", s: "engagement rate", intent: "positive" },
      ],
      sources: ["Engagement · Top creators"],
    },
  ],
};

const chatHistory = Object.keys(chatArchive);

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [activeHistory, setActiveHistory] = useState<string | null>("Negative spike investigation");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  function newConversation() {
    setMessages([]);
    setActiveHistory(null);
  }

  function openHistory(title: string) {
    setMessages(chatArchive[title]);
    setActiveHistory(title);
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  async function send(text?: string) {
    const prompt = (text ?? input).trim();
    if (!prompt || thinking) return;
    setInput("");
    setActiveHistory(null);
    setMessages((m) => [...m, { id: `u_${Date.now()}`, role: "user", content: prompt }]);
    setThinking(true);
    const reply = await askAssistant(prompt);
    setMessages((m) => [...m, reply]);
    setThinking(false);
  }

  return (
    <div className="flex h-[calc(100vh-54px)]">
      {/* history */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--color-border)] p-3 lg:flex">
        <button onClick={newConversation} className="mb-2 flex items-center justify-center gap-2 rounded-[9px] bg-[var(--color-primary)] py-2 text-[13px] font-medium text-white">
          <Plus className="h-4 w-4" /> New conversation
        </button>
        <p className="px-2.5 pb-1 pt-2 text-[10px] font-semibold tracking-[0.07em] text-[var(--color-faint)]">RECENT</p>
        {chatHistory.map((h) => (
          <button key={h} onClick={() => openHistory(h)} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px]", activeHistory === h ? "bg-[var(--color-subtle)] text-[var(--color-ink)]" : "text-[var(--color-muted)] hover:bg-[var(--color-subtle)]")}>
            <MessageSquare className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{h}</span>
          </button>
        ))}
      </aside>

      {/* chat */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[720px] space-y-[22px] px-6 py-7">
            {messages.map((m) => <Message key={m.id} m={m} onAction={send} />)}
            {thinking && <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)]"><Spinner className="h-4 w-4" /> Analyzing your data…</div>}
            <div ref={endRef} />
          </div>
        </div>

        {/* composer */}
        <div className="mx-auto w-full max-w-[720px] px-6 pb-[22px]">
          <div className="mb-[11px] flex flex-wrap gap-2">
            {suggestedPrompts.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[13px] py-[7px] text-[12px] text-[var(--color-muted)] hover:text-[var(--color-ink)]">{s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2.5 rounded-[13px] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-[6px_6px_6px_16px]">
            <span className="text-[var(--color-primary-ink)]">✦</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
              placeholder="Ask anything about Vela’s social data…"
              className="h-[34px] flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--color-faint)]"
            />
            <button onClick={() => send()} className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[var(--color-primary)] text-white"><ArrowUp className="h-4 w-4" /></button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--color-faint)]">socialNET AI reasons over your live mention data · responses are source-backed</p>
        </div>
      </div>
    </div>
  );
}

function Message({ m, onAction }: { m: ChatMessage; onAction: (t: string) => void }) {
  if (m.role === "user") {
    return <div className="ml-auto max-w-[80%] rounded-[14px_14px_4px_14px] bg-[var(--color-primary)] px-4 py-[11px] text-[14px] text-white">{m.content}</div>;
  }
  return (
    <div className="flex gap-3.5">
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(135deg,#6366f1,#a855f7)] text-white">✦</span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] leading-[1.65] text-[var(--color-muted)]">{m.content}</p>
        {m.cards && (
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {m.cards.map((c, i) => (
              <div key={i} className="card min-w-[130px] flex-1 p-[13px_14px]">
                <div className="mb-[7px] text-[11px] text-[var(--color-faint)]">{c.t}</div>
                <div className="mono text-[18px] font-semibold" style={{ color: cardColor[c.intent] }}>{c.v}</div>
                <div className="mt-0.5 text-[10px] text-[var(--color-faint)]">{c.s}</div>
              </div>
            ))}
          </div>
        )}
        {m.sources && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-[0.05em] text-[var(--color-faint)]">SOURCES</span>
            {m.sources.map((s) => <span key={s} className="mono rounded-md bg-[var(--color-track)] px-2.5 py-1 text-[11px] text-[var(--color-muted)]">{s}</span>)}
          </div>
        )}
        {m.action && (
          <Link href={m.action.href} className="mt-3.5 inline-flex items-center gap-1.5 rounded-[9px] border border-[rgba(239,68,68,.3)] bg-[var(--color-critical-soft)] px-[15px] py-2 text-[13px] font-medium text-[var(--color-critical)]">
            ◈ {m.action.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
