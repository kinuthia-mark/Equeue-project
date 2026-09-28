"use client";

import { PALETTE } from "./Charts";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["0", "3", "6", "9", "12", "15", "18", "21"];

function val(d: number, h: number) {
  const base = Math.sin((d + 1) / 2) + Math.cos((h + 1) / 2.5);
  const peak = h >= 3 && h <= 6 ? 1.2 : 0.4; // midday/evening peaks
  return Math.max(0, Math.min(1, (base + 2) / 4 + peak * 0.3 + (((d * 7 + h) % 5) / 12)));
}

export function Heatmap() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="ml-10 mb-1 grid grid-cols-8 gap-1">
          {HOURS.map((h) => (
            <span key={h} className="text-center text-[10px] text-[var(--color-faint)]">
              {h}h
            </span>
          ))}
        </div>
        {DAYS.map((day, d) => (
          <div key={day} className="mb-1 flex items-center gap-1">
            <span className="w-9 text-right text-[11px] text-[var(--color-muted)]">{day}</span>
            <div className="grid flex-1 grid-cols-8 gap-1">
              {HOURS.map((_, h) => {
                const v = val(d, h);
                return (
                  <div
                    key={h}
                    title={`${day} ${HOURS[h]}:00 · ${Math.round(v * 100)}% engagement`}
                    className="aspect-[2/1] rounded"
                    style={{ background: `color-mix(in srgb, ${PALETTE.primary} ${Math.round(v * 100)}%, var(--color-subtle))` }}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="ml-10 mt-2 flex items-center gap-2 text-[10px] text-[var(--color-faint)]">
          Less
          <div className="flex gap-0.5">
            {[10, 35, 60, 85, 100].map((p) => (
              <span
                key={p}
                className="h-3 w-3 rounded"
                style={{ background: `color-mix(in srgb, ${PALETTE.primary} ${p}%, var(--color-subtle))` }}
              />
            ))}
          </div>
          More
        </div>
      </div>
    </div>
  );
}
