"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function Progress({
  value,
  className,
  color = "var(--color-primary)",
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[var(--color-subtle-2)]", className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

export function Switch({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [on, setOn] = useState(!!checked);
  const isOn = onChange ? checked : on;
  return (
    <button
      type="button"
      onClick={() => (onChange ? onChange(!checked) : setOn((v) => !v))}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        isOn ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-strong)]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          isOn ? "left-0.5 translate-x-4" : "left-0.5",
        )}
      />
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && (
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-subtle)] text-[var(--color-faint)]">
          {icon}
        </span>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--color-muted)]">{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-primary)]",
        className,
      )}
    />
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 rounded-lg bg-[var(--color-subtle)] p-1", className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
            value === t.value
              ? "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
          )}
        >
          {t.label}
          {typeof t.count === "number" && (
            <span className="rounded-full bg-[var(--color-subtle-2)] px-1.5 text-[11px] text-[var(--color-muted)]">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
