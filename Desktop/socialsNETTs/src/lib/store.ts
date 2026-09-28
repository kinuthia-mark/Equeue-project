"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DateRange } from "@/lib/types";

type Theme = "dark" | "light";
export type Density = "comfortable" | "compact";

export const NOTIFICATION_PREFS = [
  { key: "critical", label: "Critical alerts (crisis, recall)", sub: "In-app · SMS · Email" },
  { key: "sentiment", label: "Sentiment shifts", sub: "In-app · Email" },
  { key: "viral", label: "Viral post detection", sub: "In-app" },
  { key: "digest", label: "Weekly digest", sub: "Email · Mondays" },
  { key: "assignments", label: "Assignments & mentions of me", sub: "In-app · Email" },
  { key: "product", label: "Product updates", sub: "Email" },
] as const;

export const LANDING_SCREENS: { value: string; label: string }[] = [
  { value: "/dashboard", label: "Overview" },
  { value: "/mentions", label: "Mentions" },
  { value: "/analytics", label: "Analytics" },
  { value: "/crisis", label: "Crisis Center" },
  { value: "/alerts", label: "Alerts" },
];

interface UIState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  range: DateRange;
  setRange: (r: DateRange) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  togglePalette: () => void;
  density: Density;
  setDensity: (d: Density) => void;
  landingScreen: string;
  setLandingScreen: (v: string) => void;
  notificationPrefs: Record<string, boolean>;
  setNotificationPref: (key: string, on: boolean) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
      range: "7d",
      setRange: (range) => set({ range }),
      paletteOpen: false,
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
      density: "comfortable",
      setDensity: (density) => set({ density }),
      landingScreen: "/dashboard",
      setLandingScreen: (landingScreen) => set({ landingScreen }),
      notificationPrefs: Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, p.key !== "product"])),
      setNotificationPref: (key, on) => set((s) => ({ notificationPrefs: { ...s.notificationPrefs, [key]: on } })),
    }),
    {
      name: "socialnet-ui-prefs",
      partialize: (s) => ({ density: s.density, landingScreen: s.landingScreen, notificationPrefs: s.notificationPrefs }),
    },
  ),
);

export const RANGE_LABELS: Record<DateRange, string> = {
  today: "24h",
  "7d": "7d",
  "30d": "30d",
  "90d": "90d",
  custom: "Custom",
};
