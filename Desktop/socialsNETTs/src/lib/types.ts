// Domain model for socialNET (Atlas). Shapes mirror the planned Django REST
// responses so the mock API (src/lib/api.ts) swaps to live endpoints with no
// UI changes.

export type Platform = "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "reddit" | "news";
export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type Priority = "low" | "medium" | "high" | "critical";
export type Severity = "info" | "warning" | "critical";
export type Role = "admin" | "analyst" | "community" | "executive";
export const ROLE_LABELS: Record<Role, string> = { admin: "Admin", analyst: "Analyst", community: "Community Mgr", executive: "Executive" };
export type DateRange = "today" | "7d" | "30d" | "90d" | "custom";
export type Intent = "positive" | "warning" | "critical" | "info" | "neutral";

export interface Kpi {
  id: string;
  label: string;
  value: string;   // preformatted, e.g. "48.2K"
  delta: string;   // e.g. "+12.4%" or "−4pt"
  intent: Intent;  // colors the delta
  spark: number[];
}

export interface BrandHealth {
  score: number;        // 0-100
  status: string;       // "AT RISK"
  intent: Intent;
  deltaLabel: string;   // "▼ 9 pts this week"
  drivers: { label: string; value: string; intent: Intent }[];
}

export interface SeriesPoint {
  date: string;
  [key: string]: number | string;
}

export interface SentimentSlice {
  name: string;
  value: number;
  color: string;
}

export interface PlatformStat {
  platform: string;
  mentions: number;
  color: string;
}

export interface Trend {
  rank: string;
  term: string;
  vol: string;
  change: string;
  intent: Intent;
}

export interface LiveFeedItem {
  platform: Platform;
  text: string;
  meta: string;
  sentiment: Sentiment;
}

export interface Hashtag {
  tag: string;
  vol: string;
  reach: string;
  change: string;
  intent: Intent;
  spark: number[];
}

export interface SentimentBar {
  week: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformComparisonRow {
  platform: string;
  mentions: number;
  engagement: number;
}

export interface ReportType {
  title: string;
  desc: string;
  meta: string;
  type: Report["type"];
}

export interface ScheduledReport {
  id: string;
  name: string;
  freq: string;
  recipients: string;
  on: boolean;
}

export interface Author {
  name: string;
  handle: string;
  avatar?: string;
  initials: string;
  color: string;       // avatar tint
  followers: string;
  verified: boolean;
}

export interface Mention {
  id: string;
  platform: Platform;
  author: Author;
  content: string;
  time: string;            // relative, e.g. "38m"
  sentiment: Sentiment;
  priority: Priority;
  reach: string;
  likes: string;
  comments: string;
  shares: string;
  region: string;
  status: "new" | "assigned" | "resolved";
  assignee?: string;
  confidence: number;
  emotions: { k: string; v: number }[];
  topics: string[];
  suggestedReply: string;
  notes?: { author: string; text: string; at: string }[];
}

export interface Influencer {
  name: string;
  handle: string;
  platform: string;
  followers: string;
  reach: string;
  sentiment: Sentiment;
  score: number;
}

export interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  type: "spike" | "sentiment" | "viral" | "crisis" | "influencer" | "unanswered";
  time: string;
  status: "active" | "acknowledged" | "resolved";
  metric?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  channels: string;
  on: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "campaign" | "incident";
  period: string;
  generated: string;
  status: "ready" | "processing";
  highlights?: string[];
  metrics?: { label: string; value: string; delta: number }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: { t: string; v: string; s: string; intent: Intent }[];
  sources?: string[];
  action?: { label: string; href: string };
}

export interface CrisisEvent {
  id: string;
  day: string;
  time: string;
  title: string;
  detail: string;
  dot: string;            // hex
  tag: string;
  tagIntent: Intent;
}

export interface CrisisSignal {
  label: string;
  value: string;
  sub: string;
  intent: Intent;
  pct: number;
}

export interface Crisis {
  id: string;
  title: string;
  status: "monitoring" | "active" | "contained" | "resolved";
  severity: string;       // "SEV-2"
  score: number;          // 0-100
  opened: string;
  owner: string;
  summary: string;
  signals: CrisisSignal[];
  timeline: CrisisEvent[];
  strategies: { title: string; desc: string; impact: string; recommended: boolean }[];
  warRoom: { name: string; role: string; initials: string; color: string; status: string }[];
}

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  lastActive: string;
}

export interface Integration {
  id: string;
  platform: Platform;
  name: string;
  account: string;
  status: "connected" | "error" | "disconnected";
  detail: string;
}

export interface AuditLog {
  id: string;
  who: string;
  initials: string;
  color: string;
  action: string;
  target: string;
  category: "auth" | "config" | "user" | "data" | "system";
  time: string;
}

export interface PostAnalysis {
  url: string;
  platform: Platform;
  author: Author;
  content: string;
  performance: { label: string; value: string; sub: string; intent: Intent }[];
  sentiment: { positive: number; neutral: number; negative: number; tone: string };
  scores: { label: string; value: number; intent: Intent }[];
  positives: string[];
  risks: string[];
  recommendations: { icon: "amplify" | "engage" | "future"; title: string; desc: string }[];
}
