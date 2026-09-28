"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sun, Moon, BellRing } from "lucide-react";
import { useUI, RANGE_LABELS } from "@/lib/store";
import type { DateRange } from "@/lib/types";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/mentions": "Mentions",
  "/analytics": "Analytics",
  "/engagement": "Engagement",
  "/assistant": "AI Assistant",
  "/post-analysis": "Post Analysis",
  "/crisis": "Crisis Center",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/admin": "Admin",
  "/profile": "Profile",
};

const RANGES: DateRange[] = ["today", "7d", "30d", "custom"];
const WITH_RANGE = ["/dashboard", "/analytics", "/engagement"];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { range, setRange, theme, toggleTheme, setPaletteOpen } = useUI();
  const title = TITLES[pathname] ?? "socialNET";
  const showRange = WITH_RANGE.includes(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[54px] shrink-0 items-center gap-3 border-b border-[var(--color-border)] glass px-3 sm:px-5">
      <button onClick={onMenu} className="text-[var(--color-muted)] hover:text-[var(--color-ink)] lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <span className="text-[15px] font-semibold tracking-[-0.01em]">{title}</span>
      <span className="hidden items-center gap-1.5 text-[12px] text-[var(--color-faint)] sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-positive)] live-dot" />
        Vela · all platforms
      </span>

      <button
        onClick={() => setPaletteOpen(true)}
        className="ml-auto hidden h-8 w-[230px] items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[12px] text-[var(--color-faint)] hover:border-[var(--color-border-strong)] md:flex"
      >
        <Search className="h-4 w-4" />
        Search or ask AI…
        <span className="mono ml-auto rounded border border-[var(--color-border)] px-1.5 text-[10px]">⌘K</span>
      </button>

      <div className="md:hidden ml-auto" />

      {showRange && (
        <div className="hidden gap-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-[3px] sm:flex">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] transition-colors",
                range === r
                  ? "bg-[var(--color-subtle-2)] font-medium text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
              )}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={toggleTheme}
        title="Toggle theme"
        className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      >
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      <Link
        href="/alerts"
        className="relative grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      >
        <BellRing className="h-4 w-4" />
        <span className="mono absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-[var(--color-canvas)] bg-[var(--color-critical)] text-[8px] font-bold text-white">
          3
        </span>
      </Link>
    </header>
  );
}
