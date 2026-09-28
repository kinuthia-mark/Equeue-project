"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Switch } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/Sheet";
import { LANDING_SCREENS, NOTIFICATION_PREFS, useUI } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMe, useUpdateMe } from "@/lib/queries";
import { ROLE_LABELS } from "@/lib/types";

export default function ProfilePage() {
  const { theme, setTheme, density, setDensity, landingScreen, setLandingScreen, notificationPrefs, setNotificationPref } = useUI();
  const { data: me } = useMe();

  const updateMe = useUpdateMe();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editError, setEditError] = useState<string | null>(null);

  function openEdit() {
    if (!me) return;
    setForm({ name: me.name, email: me.email });
    setEditError(null);
    setEditOpen(true);
  }

  function submitEdit() {
    if (!form.name.trim() || !form.email.trim()) return;
    updateMe.mutate(form, {
      onSuccess: () => setEditOpen(false),
      onError: async (err) => setEditError(err instanceof Error ? err.message : "Couldn't save changes."),
    });
  }

  const fields = [
    { label: "Full name", value: me?.name ?? "…" },
    { label: "Email", value: me?.email ?? "…" },
    { label: "Role", value: me ? ROLE_LABELS[me.role] : "…" },
    { label: "Team", value: "Vela — Brand & Comms" },
    { label: "Timezone", value: "(GMT−05:00) Eastern" },
    { label: "Language", value: "English (US)" },
  ];

  return (
    <PageContainer className="flex max-w-[1080px] flex-col gap-4">
      <Card className="flex items-center gap-[18px] p-6">
        <Avatar initials={me?.initials ?? "…"} size="xl" />
        <div className="flex-1">
          <div className="text-[20px] font-semibold tracking-[-0.01em]">{me?.name ?? "Loading…"}</div>
          <div className="mt-0.5 text-[13px] text-[var(--color-muted)]">{me ? `${ROLE_LABELS[me.role]} · Vela` : ""}</div>
        </div>
        <button onClick={openEdit} disabled={!me} className="rounded-[9px] border border-[var(--color-border)] px-4 py-2 text-[13px] text-[var(--color-muted)] hover:bg-[var(--color-subtle)] disabled:opacity-50">Edit profile</button>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-[18px_20px]">
          <div className="mb-3.5 text-[13px] font-semibold">Account details</div>
          {fields.map((f) => (
            <div key={f.label} className="flex items-center border-t border-[var(--color-border)] py-[11px] first:border-t-0">
              <span className="w-[120px] text-[12.5px] text-[var(--color-muted)]">{f.label}</span>
              <span className="text-[13px]">{f.value}</span>
            </div>
          ))}
        </Card>

        <Card className="p-[18px_20px]">
          <div className="mb-4 text-[13px] font-semibold">Preferences</div>
          <Pref label="Appearance" sub="Interface theme">
            <div className="flex gap-0.5 rounded-[9px] bg-[var(--color-track)] p-[3px]">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTheme(m)}
                  className={cn("rounded-md px-3 py-1 text-[12px] capitalize", theme === m ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)]")}
                >
                  {m}
                </button>
              ))}
            </div>
          </Pref>
          <Pref label="Default landing screen" sub="Where socialNET opens">
            <select
              value={landingScreen}
              onChange={(e) => setLandingScreen(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-muted)] outline-none"
            >
              {LANDING_SCREENS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Pref>
          <Pref label="Density" sub="Row spacing" last>
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value as "comfortable" | "compact")}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px] text-[var(--color-muted)] outline-none"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </Pref>
        </Card>
      </div>

      <Card className="p-[18px_20px]">
        <div className="mb-1 text-[13px] font-semibold">Notification preferences</div>
        {NOTIFICATION_PREFS.map((n) => (
          <div key={n.key} className="flex items-center gap-3 border-t border-[var(--color-border)] py-[13px]">
            <div className="flex-1">
              <div className="text-[13px]">{n.label}</div>
              <div className="mono mt-0.5 text-[10px] text-[var(--color-faint)]">{n.sub}</div>
            </div>
            <Switch checked={notificationPrefs[n.key] ?? false} onChange={(on) => setNotificationPref(n.key, on)} />
          </div>
        ))}
      </Card>

      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile" width="max-w-sm">
        <div className="flex flex-col gap-3.5 p-5">
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[var(--color-muted)]">Full name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] outline-none ring-focus" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[var(--color-muted)]">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-9 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 text-[13px] outline-none ring-focus" />
          </label>
          {editError && <p className="text-[12px] text-[var(--color-critical)]">{editError}</p>}
          <button onClick={submitEdit} disabled={updateMe.isPending} className="mt-2 rounded-[9px] bg-[var(--color-primary)] py-2.5 text-[13px] font-medium text-white disabled:opacity-50">Save changes</button>
        </div>
      </Sheet>
    </PageContainer>
  );
}

function Pref({ label, sub, children, last }: { label: string; sub: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("flex items-center py-3.5", !last && "border-b border-[var(--color-border)]", "first:pt-0")}>
      <div>
        <div className="text-[13px]">{label}</div>
        <div className="mt-0.5 text-[11px] text-[var(--color-faint)]">{sub}</div>
      </div>
      <div className="ml-auto">{children}</div>
    </div>
  );
}
