// ─────────────────────────────────────────────────────────────────────────────
// API seam — the ONLY place the UI reads data. Every function calls the Django
// REST backend in ../../backend. Signatures and the types in src/lib/types.ts
// are unchanged from the mock-data version, so no component changes are needed.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Kpi, BrandHealth, Mention, SeriesPoint, Alert, AlertRule, Report, ReportType, ScheduledReport,
  Crisis, CrisisEvent, ChatMessage, PostAnalysis, TeamUser, Integration, AuditLog, Influencer, DateRange,
  SentimentSlice, PlatformStat, Trend, LiveFeedItem, Hashtag, SentimentBar, PlatformComparisonRow,
} from "@/lib/types";

// Same-origin by default — next.config.mjs rewrites /api/* to the Django
// backend server-side, so the browser never makes a cross-port request.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// The JWT access token is a short-lived (15min) httpOnly cookie — the browser
// sends it automatically, but on a 401 (expired) we transparently refresh via
// Next's /api/auth/refresh route handler and retry once before giving up.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function request<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (res.status === 401 && !isRetry) {
    if (await refreshSession()) return request<T>(path, init, true);
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error(`${init?.method ?? "GET"} ${path} failed: 401`);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail ?? (Array.isArray(body?.email) ? body.email[0] : undefined);
    throw new Error(detail ?? `${init?.method ?? "GET"} ${path} failed: ${res.status}`);
  }
  return res.json();
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const getJson = <T>(path: string) => request<T>(path);
const postJson = <T>(path: string, body: unknown) => request<T>(path, jsonInit("POST", body));
const patchJson = <T>(path: string, body: unknown) => request<T>(path, jsonInit("PATCH", body));

/* Overview */
export const getKpis = (): Promise<Kpi[]> => getJson("/kpis");
export const getBrandHealth = (): Promise<BrandHealth> => getJson("/brand-health");
export const getMentionVolume = (range: DateRange = "7d") => getJson<SeriesPoint[]>(`/mention-volume?range=${range}`);
export const getSentimentDistribution = () => getJson<SentimentSlice[]>("/sentiment-distribution");
export const getPlatformBreakdown = () => getJson<PlatformStat[]>("/platform-breakdown");
export const getTrends = () => getJson<Trend[]>("/trends");
export const getLiveFeed = () => getJson<LiveFeedItem[]>("/live-feed");

/* Analytics */
export const getHashtags = () => getJson<Hashtag[]>("/hashtags");
export const getSentimentBars = () => getJson<SentimentBar[]>("/sentiment-bars");
export const getPlatformComparison = () => getJson<PlatformComparisonRow[]>("/platform-comparison");
export const getInfluencers = (): Promise<Influencer[]> => getJson("/influencers");
export const getEngagementSeries = (range: DateRange = "7d") => getJson<SeriesPoint[]>(`/engagement-series?range=${range}`);

/* Mentions */
export const getMentions = (): Promise<Mention[]> => getJson("/mentions");
export const updateMention = (id: string, patch: Partial<Pick<Mention, "status" | "assignee">>): Promise<Mention> =>
  patchJson(`/mentions/${id}`, patch);
export const replyToMention = (id: string, text: string): Promise<Mention> =>
  postJson(`/mentions/${id}/reply`, { text });
export const addMentionNote = (id: string, text: string, author?: string): Promise<Mention> =>
  postJson(`/mentions/${id}/notes`, { text, author });

/* Alerts */
export const getAlerts = (): Promise<Alert[]> => getJson("/alerts");
export const getAlertRules = (): Promise<AlertRule[]> => getJson("/alert-rules");
export const addAlertRule = (rule: Pick<AlertRule, "name" | "condition" | "channels">): Promise<AlertRule> =>
  postJson("/alert-rules", rule);
export const updateAlertRule = (id: string, patch: Partial<AlertRule>): Promise<AlertRule> =>
  patchJson(`/alert-rules/${id}`, patch);

/* Crisis */
export const getCrises = (): Promise<Crisis[]> => getJson("/crises");
export const updateCrisis = (id: string, patch: Partial<Pick<Crisis, "status" | "score">>): Promise<Crisis> =>
  patchJson(`/crises/${id}`, patch);
export const addCrisisEvent = (id: string, event: Partial<Omit<CrisisEvent, "id" | "day">>): Promise<Crisis> =>
  postJson(`/crises/${id}/events`, event);

/* AI */
export const askAssistant = (prompt: string): Promise<ChatMessage> => postJson("/assistant", { prompt });
export const analyzePost = (url: string): Promise<PostAnalysis> => postJson("/post-analysis", { url });

/* Reports */
export const getReports = (): Promise<Report[]> => getJson("/reports");
export const getReportTypes = () => getJson<ReportType[]>("/report-types");
export const generateReport = (report: Pick<Report, "title" | "type" | "period">): Promise<Report> =>
  postJson("/reports", report);
export const reportDownloadUrl = (id: string) => `${API_URL}/reports/${id}/download`;
export const getScheduledReports = () => getJson<ScheduledReport[]>("/scheduled-reports");
export const addScheduledReport = (s: Pick<ScheduledReport, "name" | "freq" | "recipients">): Promise<ScheduledReport> =>
  postJson("/scheduled-reports", s);
export const updateScheduledReport = (id: string, patch: Partial<ScheduledReport>): Promise<ScheduledReport> =>
  patchJson(`/scheduled-reports/${id}`, patch);

/* Admin */
export const getTeam = (): Promise<TeamUser[]> => getJson("/team");
export const inviteTeamMember = (member: { name: string; email: string; role: TeamUser["role"] }): Promise<TeamUser> =>
  postJson("/team", member);
export const updateTeamMember = (id: string, patch: Partial<Pick<TeamUser, "name" | "email" | "role">>): Promise<TeamUser> =>
  patchJson(`/team/${id}`, patch);
export const getIntegrations = (): Promise<Integration[]> => getJson("/integrations");
export const updateIntegration = (id: string, patch: Partial<Pick<Integration, "status" | "detail">>): Promise<Integration> =>
  patchJson(`/integrations/${id}`, patch);
export const getAuditLogs = (): Promise<AuditLog[]> => getJson("/audit-logs");

/* Auth — the signed-in user's own profile (see src/app/api/auth for login/
   register/refresh/logout, which own the httpOnly session cookies). */
export const getMe = (): Promise<TeamUser> => getJson("/auth/me");
export const updateMe = (patch: Partial<Pick<TeamUser, "name" | "email">>): Promise<TeamUser> => patchJson("/auth/me", patch);
