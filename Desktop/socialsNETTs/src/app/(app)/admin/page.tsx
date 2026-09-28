"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/Sheet";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import {
  useTeam, useIntegrations, useAuditLogs, useInviteTeamMember, useUpdateIntegration,
} from "@/lib/queries";
import { downloadCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role, type TeamUser, type Integration } from "@/lib/types";

type Tab = "users" | "integrations" | "audit";

const roleLabel = ROLE_LABELS;
const statusTone: Record<TeamUser["status"], "positive" | "info" | "critical"> = { active: "positive", invited: "info", suspended: "critical" };
const intStatus: Record<Integration["status"], { tone: "positive" | "critical" | "neutral"; label: string }> = {
  connected: { tone: "positive", label: "Connected" },
  error: { tone: "critical", label: "Action needed" },
  disconnected: { tone: "neutral", label: "Not connected" },
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("users");
  const team = useTeam();
  const integrations = useIntegrations();
  const audit = useAuditLogs();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState<{ name: string; email: string; role: Role }>({ name: "", email: "", role: "analyst" });
  const inviteMutation = useInviteTeamMember();

  const [manageTarget, setManageTarget] = useState<Integration | null>(null);
  const updateIntegration = useUpdateIntegration();

  function submitInvite() {
    if (!invite.name.trim() || !invite.email.trim()) return;
    inviteMutation.mutate(invite, {
      onSuccess: () => { setInvite({ name: "", email: "", role: "analyst" }); setInviteOpen(false); },
    });
  }

  function connect(i: Integration) {
    updateIntegration.mutate({ id: i.id, patch: { status: "connected", detail: "connected just now" } });
  }

  function disconnect(i: Integration) {
    updateIntegration.mutate({ id: i.id, patch: { status: "disconnected", detail: "Connect to track mentions" } });
    setManageTarget(null);
  }

  function exportAudit() {
    downloadCsv("audit-log", (audit.data ?? []).map((l) => ({ who: l.who, action: l.action, target: l.target, category: l.category, time: l.time })));
  }

  return (
    <PageContainer>
      <div className="mb-[18px] flex gap-1 border-b border-[var(--color-border)]">
        {(["users", "integrations", "audit"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-[13.5px] font-medium capitalize",
              tab === t ? "border-[var(--color-primary)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          <div className="mb-3.5 flex items-center">
            <span className="text-[14px] font-semibold">Team members</span>
            <span className="mono ml-2.5 text-[11px] text-[var(--color-faint)]">{team.data?.length ?? 0} users</span>
            <button onClick={() => setInviteOpen(true)} className="ml-auto rounded-[9px] bg-[var(--color-primary)] px-3.5 py-2 text-[13px] font-medium text-white">+ Invite user</button>
          </div>
          <Card className="overflow-hidden">
            <div className="mono grid grid-cols-[2fr_1.4fr_1fr_1fr_60px] border-b border-[var(--color-border)] px-[18px] py-2.5 text-[10px] text-[var(--color-faint)]">
              <span>NAME</span><span>EMAIL</span><span>ROLE</span><span>LAST ACTIVE</span><span></span>
            </div>
            {team.data ? team.data.map((u) => (
              <div key={u.id} className="grid grid-cols-[2fr_1.4fr_1fr_1fr_60px] items-center border-b border-[var(--color-border)] px-[18px] py-3 last:border-0 hover:bg-[var(--color-subtle)]">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar initials={u.initials} color={u.color} size="sm" />
                  <span className="truncate text-[13px] font-medium">{u.name}</span>
                </div>
                <span className="mono truncate text-[11.5px] text-[var(--color-muted)]">{u.email}</span>
                <span><span className="rounded-md bg-[var(--color-track)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]">{roleLabel[u.role]}</span></span>
                <span><Badge tone={statusTone[u.status]} dot>{cap(u.status)}</Badge></span>
                <span className="text-right text-[var(--color-faint)]">⋯</span>
              </div>
            )) : <div className="p-5"><Skeleton className="h-40 w-full" /></div>}
          </Card>
        </div>
      )}

      {tab === "integrations" && (
        <div>
          <div className="mb-3.5 text-[14px] font-semibold">Connected platforms</div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.data ? integrations.data.map((i) => {
              const st = intStatus[i.status];
              return (
                <Card key={i.id} className="p-[18px]">
                  <div className="mb-3 flex items-center gap-[11px]">
                    <PlatformIcon platform={i.platform} badge className="h-[38px] w-[38px]" />
                    <span className="text-[14px] font-semibold">{i.name}</span>
                  </div>
                  <div className="mb-2.5"><Badge tone={st.tone} dot>{st.label}</Badge></div>
                  <p className="mb-3 text-[11px] text-[var(--color-faint)]">{i.account} · {i.detail}</p>
                  <button
                    onClick={() => (i.status === "connected" ? setManageTarget(i) : connect(i))}
                    disabled={updateIntegration.isPending}
                    className="block w-full rounded-lg border border-[var(--color-border)] py-2 text-center text-[12px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)] disabled:opacity-50"
                  >
                    {i.status === "connected" ? "Manage" : i.status === "error" ? "Reconnect" : "Connect"}
                  </button>
                </Card>
              );
            }) : Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-[14px]" />)}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div>
          <div className="mb-3.5 flex items-center">
            <span className="text-[14px] font-semibold">Audit log</span>
            <button onClick={exportAudit} className="ml-auto rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[12px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)]">Export CSV</button>
          </div>
          <Card className="overflow-hidden">
            {audit.data ? audit.data.map((l) => (
              <div key={l.id} className="flex items-center gap-3 border-b border-[var(--color-border)] px-[18px] py-3.5 last:border-0">
                <Avatar initials={l.initials} color={l.color} size="xs" />
                <div className="flex-1 text-[13px]">
                  <span className="font-medium">{l.who}</span>{" "}
                  <span className="text-[var(--color-muted)]">{l.action}</span>{" "}
                  <span className="text-[var(--color-primary-ink)]">{l.target}</span>
                </div>
                <span className="mono text-[11px] text-[var(--color-faint)]">{l.time}</span>
              </div>
            )) : <div className="p-5"><Skeleton className="h-40 w-full" /></div>}
          </Card>
        </div>
      )}

      {/* Invite user */}
      <Sheet open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite user" width="max-w-sm">
        <div className="flex flex-col gap-3.5 p-5">
          <Field label="Full name">
            <input value={invite.name} onChange={(e) => setInvite((v) => ({ ...v, name: e.target.value }))} className="h-9 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] outline-none ring-focus" />
          </Field>
          <Field label="Work email">
            <input type="email" value={invite.email} onChange={(e) => setInvite((v) => ({ ...v, email: e.target.value }))} className="h-9 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] outline-none ring-focus" />
          </Field>
          <Field label="Role">
            <select value={invite.role} onChange={(e) => setInvite((v) => ({ ...v, role: e.target.value as Role }))} className="h-9 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] outline-none">
              {(Object.keys(roleLabel) as Role[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
            </select>
          </Field>
          <button onClick={submitInvite} disabled={inviteMutation.isPending} className="mt-2 rounded-[9px] bg-[var(--color-primary)] py-2.5 text-[13px] font-medium text-white disabled:opacity-50">Send invite</button>
        </div>
      </Sheet>

      {/* Manage integration */}
      <Sheet open={!!manageTarget} onClose={() => setManageTarget(null)} title={manageTarget?.name} width="max-w-sm">
        {manageTarget && (
          <div className="flex flex-col gap-3.5 p-5">
            <div className="flex items-center gap-3">
              <PlatformIcon platform={manageTarget.platform} badge className="h-10 w-10" />
              <div>
                <div className="text-[13px] font-medium">{manageTarget.account}</div>
                <div className="text-[11px] text-[var(--color-faint)]">{manageTarget.detail}</div>
              </div>
            </div>
            <button onClick={() => disconnect(manageTarget)} disabled={updateIntegration.isPending} className="rounded-[9px] border border-[rgba(239,68,68,.35)] py-2.5 text-[13px] text-[var(--color-critical)] hover:bg-[var(--color-critical-soft)] disabled:opacity-50">
              Disconnect
            </button>
          </div>
        )}
      </Sheet>
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
