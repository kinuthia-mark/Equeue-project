"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Activity, Flame, ShieldAlert, Star, Clock, Bell, Mail, Smartphone, Hash } from "lucide-react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Switch, Skeleton } from "@/components/ui/misc";
import { useAddAlertRule, useAlerts, useAlertRules, useUpdateAlertRule } from "@/lib/queries";
import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/types";

const typeIcon: Record<Alert["type"], React.ElementType> = {
  spike: TrendingUp, sentiment: Activity, viral: Flame, crisis: ShieldAlert, influencer: Star, unanswered: Clock,
};
const sevColor: Record<string, string> = {
  critical: "var(--color-critical)", warning: "var(--color-warning)", info: "var(--color-info)",
};
const channels = [
  { name: "In-app", sub: "Real-time toast + center", icon: Bell },
  { name: "Email", sub: "Ochiengs@vela.co +3", icon: Mail },
  { name: "SMS", sub: "Critical only", icon: Smartphone },
  { name: "Slack", sub: "#brand-war-room", icon: Hash },
];

export default function AlertsPage() {
  const alerts = useAlerts();
  const rules = useAlertRules();
  const addRule = useAddAlertRule();
  const updateRule = useUpdateAlertRule();
  const [newRuleOpen, setNewRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", condition: "", channels: "" });

  function submitNewRule() {
    if (!newRule.name.trim() || !newRule.condition.trim()) return;
    addRule.mutate(newRule, { onSuccess: () => { setNewRule({ name: "", condition: "", channels: "" }); setNewRuleOpen(false); } });
  }

  return (
    <PageContainer className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
      {/* feed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <span className="text-[15px] font-semibold">Triggered alerts</span>
          <span className="mono ml-auto text-[11px] text-[var(--color-faint)]">Last 24h</span>
        </div>
        {alerts.data ? alerts.data.map((a) => {
          const Icon = typeIcon[a.type];
          return (
            <Link key={a.id} href="/crisis" className="card block border-l-[3px] p-[15px_17px]" style={{ borderLeftColor: sevColor[a.severity] }}>
              <div className="mb-[7px] flex items-center gap-2.5">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-[var(--color-track)]" style={{ color: sevColor[a.severity] }}><Icon className="h-3.5 w-3.5" /></span>
                <span className="text-[14px] font-medium">{a.title}</span>
                <span className="rounded-[5px] border px-2 py-0.5 text-[10px] capitalize" style={{ color: sevColor[a.severity], borderColor: sevColor[a.severity] }}>{a.severity}</span>
                <span className="mono ml-auto text-[10px] text-[var(--color-faint)]">{a.time}</span>
              </div>
              <p className="ml-9 text-[12.5px] leading-[1.5] text-[var(--color-muted)]">{a.description}</p>
              <div className="ml-9 mt-2 flex items-center gap-2">
                <span className="mono text-[10px] capitalize text-[var(--color-faint)]">Status: {a.status}</span>
                <span className="ml-auto text-[11px] text-[var(--color-primary-ink)]">Investigate →</span>
              </div>
            </Link>
          );
        }) : <Skeleton className="h-72 rounded-[14px]" />}
      </div>

      {/* config */}
      <div className="flex flex-col gap-3.5">
        <Card className="p-[16px_18px]">
          <div className="mb-3.5 flex items-center">
            <span className="text-[13px] font-semibold">Alert rules</span>
            <button onClick={() => setNewRuleOpen((v) => !v)} className="ml-auto text-[11px] text-[var(--color-primary-ink)] hover:underline">+ New rule</button>
          </div>
          {newRuleOpen && (
            <div className="mb-3 flex flex-col gap-2 rounded-[11px] border border-[var(--color-border)] p-[12px]">
              <input value={newRule.name} onChange={(e) => setNewRule((r) => ({ ...r, name: e.target.value }))} placeholder="Rule name" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <input value={newRule.condition} onChange={(e) => setNewRule((r) => ({ ...r, condition: e.target.value }))} placeholder="Condition (e.g. Mentions +100% in 1h)" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <input value={newRule.channels} onChange={(e) => setNewRule((r) => ({ ...r, channels: e.target.value }))} placeholder="Channels (e.g. In-app · Email)" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <button onClick={submitNewRule} disabled={addRule.isPending} className="self-end rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50">Add rule</button>
            </div>
          )}
          {rules.data ? rules.data.map((r) => (
            <div key={r.id} className="border-t border-[var(--color-border)] py-[11px] first:border-t-0">
              <div className="flex items-center gap-2.5">
                <span className="flex-1 text-[13px] font-medium">{r.name}</span>
                <Switch checked={r.on} onChange={(on) => updateRule.mutate({ id: r.id, patch: { on } })} />
              </div>
              <div className="mono mt-1 text-[11px] text-[var(--color-muted)]">{r.condition}</div>
              <div className="mt-0.5 text-[10px] text-[var(--color-faint)]">{r.channels}</div>
            </div>
          )) : <Skeleton className="h-40" />}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-3.5 text-[13px] font-semibold">Notification channels</div>
          <div className="grid grid-cols-2 gap-2.5">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className="rounded-[11px] border border-[var(--color-border)] p-[12px_13px]">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-[var(--color-primary-ink)]" />
                    <span className="text-[12.5px] font-medium">{c.name}</span>
                    <span className="ml-auto h-[7px] w-[7px] rounded-full bg-[var(--color-positive)]" />
                  </div>
                  <div className="text-[10px] text-[var(--color-faint)]">{c.sub}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
