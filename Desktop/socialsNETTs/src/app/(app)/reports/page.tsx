"use client";

import { useState } from "react";
import { Sun, CalendarRange, FileBarChart, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageHeading";
import { Card } from "@/components/ui/Card";
import { Switch, Skeleton } from "@/components/ui/misc";
import {
  useReports, useReportTypes, useScheduledReports,
  useGenerateReport, useAddScheduledReport, useUpdateScheduledReport,
} from "@/lib/queries";
import { reportDownloadUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/types";

const typeIcon: Record<string, React.ElementType> = {
  daily: Sun, weekly: CalendarRange, monthly: FileBarChart, campaign: Sparkles,
};

export default function ReportsPage() {
  const reports = useReports();
  const types = useReportTypes();
  const scheduled = useScheduledReports();
  const generateReport = useGenerateReport();
  const addSchedule = useAddScheduledReport();
  const updateSchedule = useUpdateScheduledReport();

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState({ name: "", freq: "", recipients: "" });

  function generate(type: Report["type"], title: string) {
    generateReport.mutate({ title, type, period: "On demand" });
  }

  function submitSchedule() {
    if (!schedule.name.trim() || !schedule.freq.trim()) return;
    addSchedule.mutate(schedule, { onSuccess: () => { setSchedule({ name: "", freq: "", recipients: "" }); setScheduleOpen(false); } });
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center">
        <span className="text-[15px] font-semibold">Reporting hub</span>
        <span className="mono ml-2.5 text-[11px] text-[var(--color-faint)]">automated &amp; on-demand</span>
        <button
          onClick={() => generate("campaign", "On-demand report")}
          disabled={generateReport.isPending}
          className="ml-auto rounded-[9px] bg-[var(--color-primary)] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50"
        >
          + Generate report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {types.data ? types.data.map((r) => {
          const Icon = typeIcon[r.type] ?? FileBarChart;
          return (
            <Card
              key={r.title}
              onClick={() => generate(r.type as Report["type"], r.title)}
              className="cursor-pointer p-[18px] transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="mb-3 grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]"><Icon className="h-4 w-4" /></div>
              <div className="mb-1 text-[14px] font-semibold">{r.title}</div>
              <div className="mb-2.5 min-h-[34px] text-[12px] leading-[1.45] text-[var(--color-muted)]">{r.desc}</div>
              <div className="mono text-[10px] text-[var(--color-faint)]">{r.meta}</div>
            </Card>
          );
        }) : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-[14px]" />)}
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-[18px] py-[15px] text-[13px] font-semibold">Recent reports</div>
          <div className="mono grid grid-cols-[2.2fr_1fr_1.2fr_70px] border-b border-[var(--color-border)] px-[18px] py-2.5 text-[10px] text-[var(--color-faint)]">
            <span>NAME</span><span>TYPE</span><span>GENERATED</span><span></span>
          </div>
          {reports.data ? reports.data.map((r) => (
            <div key={r.id} className="grid grid-cols-[2.2fr_1fr_1.2fr_70px] items-center border-b border-[var(--color-border)] px-[18px] py-3 last:border-0 hover:bg-[var(--color-subtle)]">
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{r.title}</div>
                <div className="mono text-[10px] text-[var(--color-faint)]">{r.period}</div>
              </div>
              <span className="text-[11px] capitalize text-[var(--color-muted)]">{r.type}</span>
              <span className="mono text-[11px]" style={{ color: r.status === "ready" ? "var(--color-positive)" : "var(--color-warning)" }}>{r.generated}</span>
              {r.status === "ready" ? (
                <a href={reportDownloadUrl(r.id)} className="text-right text-[11px] text-[var(--color-primary-ink)] hover:underline">PDF ↓</a>
              ) : (
                <span className="text-right text-[11px] text-[var(--color-faint)]">…</span>
              )}
            </div>
          )) : <div className="p-5"><Skeleton className="h-40" /></div>}
        </Card>

        <Card className="p-[16px_18px]">
          <div className="mb-3.5 flex items-center">
            <span className="text-[13px] font-semibold">Scheduled</span>
            <button onClick={() => setScheduleOpen((v) => !v)} className="ml-auto text-[11px] text-[var(--color-primary-ink)] hover:underline">+ Add</button>
          </div>
          {scheduleOpen && (
            <div className="mb-3 flex flex-col gap-2 rounded-[11px] border border-[var(--color-border)] p-[12px]">
              <input value={schedule.name} onChange={(e) => setSchedule((s) => ({ ...s, name: e.target.value }))} placeholder="Report name" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <input value={schedule.freq} onChange={(e) => setSchedule((s) => ({ ...s, freq: e.target.value }))} placeholder="Frequency (e.g. Weekly · Mon · 8:00 AM)" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <input value={schedule.recipients} onChange={(e) => setSchedule((s) => ({ ...s, recipients: e.target.value }))} placeholder="Recipients" className="h-8 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[12px] outline-none ring-focus" />
              <button onClick={submitSchedule} disabled={addSchedule.isPending} className="self-end rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50">Add</button>
            </div>
          )}
          {scheduled.data ? scheduled.data.map((s) => (
            <div key={s.id} className="border-t border-[var(--color-border)] py-[11px] first:border-t-0">
              <div className="flex items-center gap-2.5">
                <span className="flex-1 text-[13px] font-medium">{s.name}</span>
                <Switch checked={s.on} onChange={(on) => updateSchedule.mutate({ id: s.id, patch: { on } })} />
              </div>
              <div className="mono mt-1 text-[10px] text-[var(--color-muted)]">{s.freq}</div>
              <div className="mt-0.5 text-[10px] text-[var(--color-faint)]">→ {s.recipients}</div>
            </div>
          )) : <Skeleton className="h-40" />}
        </Card>
      </div>
    </PageContainer>
  );
}
