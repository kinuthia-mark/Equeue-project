import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Music2,
  MessageSquare,
  Newspaper,
} from "lucide-react";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

const map: Record<Platform, { icon: React.ElementType; color: string; label: string }> = {
  twitter: { icon: Twitter, color: "#1d9bf0", label: "Twitter / X" },
  instagram: { icon: Instagram, color: "#e1306c", label: "Instagram" },
  facebook: { icon: Facebook, color: "#1877f2", label: "Facebook" },
  linkedin: { icon: Linkedin, color: "#0a66c2", label: "LinkedIn" },
  youtube: { icon: Youtube, color: "#ff0000", label: "YouTube" },
  tiktok: { icon: Music2, color: "#010101", label: "TikTok" },
  reddit: { icon: MessageSquare, color: "#ff4500", label: "Reddit" },
  news: { icon: Newspaper, color: "#6b7280", label: "News" },
};

export function platformLabel(p: Platform) {
  return map[p].label;
}

export function PlatformIcon({
  platform,
  className,
  badge = false,
}: {
  platform: Platform;
  className?: string;
  badge?: boolean;
}) {
  const { icon: Icon, color } = map[platform];
  if (badge) {
    return (
      <span
        className={cn("grid h-7 w-7 place-items-center rounded-lg", className)}
        style={{ background: `${color}1a`, color }}
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  }
  return <Icon className={cn("h-4 w-4", className)} style={{ color }} />;
}
