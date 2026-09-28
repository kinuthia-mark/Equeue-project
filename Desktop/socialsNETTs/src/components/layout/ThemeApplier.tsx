"use client";

import { useEffect } from "react";
import { useUI } from "@/lib/store";

export function ThemeApplier() {
  const theme = useUI((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return null;
}
