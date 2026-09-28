"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useUI } from "@/lib/store";
import { allNavItems } from "./nav";

const HINTS: Record<string, string> = {
  "/dashboard": "G O", "/mentions": "G M", "/assistant": "G A",
  "/crisis": "G C", "/post-analysis": "G P", "/admin": "G S",
};

export function CommandPalette() {
  const router = useRouter();
  const { paletteOpen, setPaletteOpen, togglePalette } = useUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePalette, setPaletteOpen]);

  if (!paletteOpen) return null;

  const go = (href: string) => {
    router.push(href);
    setPaletteOpen(false);
  };

  return (
    <div
      onClick={() => setPaletteOpen(false)}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 pt-[120px] backdrop-blur-[3px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in w-[560px] max-w-[92vw] overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] shadow-[var(--shadow-pop)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3.5">
          <Search className="h-4 w-4 text-[var(--color-faint)]" />
          <input
            autoFocus
            placeholder="Search mentions, jump to a screen, or ask the AI…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-faint)]"
          />
          <span className="mono rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-faint)]">ESC</span>
        </div>
        <div className="max-h-[340px] overflow-y-auto p-2">
          <p className="px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.06em] text-[var(--color-faint)]">JUMP TO</p>
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[var(--color-subtle)]"
              >
                <Icon className="h-4 w-4 text-[var(--color-muted)]" />
                <span className="flex-1 text-[13px]">{item.label}</span>
                {HINTS[item.href] && (
                  <span className="mono text-[10px] text-[var(--color-faint)]">{HINTS[item.href]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
