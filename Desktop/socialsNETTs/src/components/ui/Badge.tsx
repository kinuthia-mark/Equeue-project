import { cn } from "@/lib/utils";
import type { Sentiment, Priority, Severity } from "@/lib/types";

type Tone = "neutral" | "primary" | "positive" | "warning" | "critical" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]",
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]",
  positive: "bg-[var(--color-positive-soft)] text-[var(--color-positive)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  critical: "bg-[var(--color-critical-soft)] text-[var(--color-critical)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  dot,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const sentimentTone: Record<Sentiment, Tone> = {
  positive: "positive",
  neutral: "neutral",
  negative: "critical",
  mixed: "warning",
};

const sentimentLabel: Record<Sentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  mixed: "Mixed",
};

export function SentimentBadge({ value }: { value: Sentiment }) {
  return (
    <Badge tone={sentimentTone[value]} dot>
      {sentimentLabel[value]}
    </Badge>
  );
}

const priorityTone: Record<Priority, Tone> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  critical: "critical",
};

export function PriorityBadge({ value }: { value: Priority }) {
  return <Badge tone={priorityTone[value]}>{value[0].toUpperCase() + value.slice(1)}</Badge>;
}

const severityTone: Record<Severity, Tone> = {
  info: "info",
  warning: "warning",
  critical: "critical",
};

export function SeverityBadge({ value }: { value: Severity }) {
  return (
    <Badge tone={severityTone[value]} dot>
      {value[0].toUpperCase() + value.slice(1)}
    </Badge>
  );
}
