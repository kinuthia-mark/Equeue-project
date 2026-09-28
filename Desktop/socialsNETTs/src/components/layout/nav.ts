import {
  LayoutGrid, MessageSquareQuote, BarChart3, Heart, Sparkles, ScanLine,
  ShieldAlert, BellRing, FileText, Settings, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  critical?: boolean;
}

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "MONITOR",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutGrid },
      { href: "/mentions", label: "Mentions", icon: MessageSquareQuote, badge: "1.2k" },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/engagement", label: "Engagement", icon: Heart },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { href: "/assistant", label: "AI Assistant", icon: Sparkles },
      { href: "/post-analysis", label: "Post Analysis", icon: ScanLine },
      { href: "/crisis", label: "Crisis Center", icon: ShieldAlert, badge: "!", critical: true },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { href: "/alerts", label: "Alerts", icon: BellRing, badge: "3", critical: true },
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/admin", label: "Admin", icon: Settings },
    ],
  },
];

export const allNavItems = navGroups.flatMap((g) => g.items);
