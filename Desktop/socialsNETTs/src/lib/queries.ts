"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { useUI } from "@/lib/store";
import type { AlertRule, Integration, Mention, Report, ScheduledReport, TeamUser } from "@/lib/types";

export const useKpis = () => useQuery({ queryKey: ["kpis"], queryFn: api.getKpis });
export const useBrandHealth = () => useQuery({ queryKey: ["health"], queryFn: api.getBrandHealth });
export function useMentionVolume() {
  const range = useUI((s) => s.range);
  return useQuery({ queryKey: ["volume", range], queryFn: () => api.getMentionVolume(range) });
}
export const useSentiment = () => useQuery({ queryKey: ["sentiment"], queryFn: api.getSentimentDistribution });
export const usePlatformBreakdown = () => useQuery({ queryKey: ["platforms"], queryFn: api.getPlatformBreakdown });
export const useTrends = () => useQuery({ queryKey: ["trends"], queryFn: api.getTrends });
export const useLiveFeed = () => useQuery({ queryKey: ["livefeed"], queryFn: api.getLiveFeed });
export const useHashtags = () => useQuery({ queryKey: ["hashtags"], queryFn: api.getHashtags });
export const useSentimentBars = () => useQuery({ queryKey: ["sentbars"], queryFn: api.getSentimentBars });
export const usePlatformComparison = () => useQuery({ queryKey: ["platcomp"], queryFn: api.getPlatformComparison });
export const useInfluencers = () => useQuery({ queryKey: ["influencers"], queryFn: api.getInfluencers });
export function useEngagementSeries() {
  const range = useUI((s) => s.range);
  return useQuery({ queryKey: ["engagement", range], queryFn: () => api.getEngagementSeries(range) });
}

/* Mentions */
export const useMentions = () => useQuery({ queryKey: ["mentions"], queryFn: api.getMentions });

export function useUpdateMention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Mention, "status" | "assignee">> }) =>
      api.updateMention(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentions"] }),
  });
}

export function useReplyToMention() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => api.replyToMention(id, text),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentions"] }),
  });
}

export function useAddMentionNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text, author }: { id: string; text: string; author?: string }) =>
      api.addMentionNote(id, text, author),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mentions"] }),
  });
}

/* Alerts */
export const useAlerts = () => useQuery({ queryKey: ["alerts"], queryFn: api.getAlerts });
export const useAlertRules = () => useQuery({ queryKey: ["alertrules"], queryFn: api.getAlertRules });

export function useAddAlertRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rule: Pick<AlertRule, "name" | "condition" | "channels">) => api.addAlertRule(rule),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alertrules"] }),
  });
}

export function useUpdateAlertRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AlertRule> }) => api.updateAlertRule(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alertrules"] }),
  });
}

/* Crisis */
export const useCrises = () => useQuery({ queryKey: ["crises"], queryFn: api.getCrises });

export function useUpdateCrisis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof api.updateCrisis>[1] }) =>
      api.updateCrisis(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crises"] }),
  });
}

export function useAddCrisisEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: Parameters<typeof api.addCrisisEvent>[1] }) =>
      api.addCrisisEvent(id, event),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crises"] }),
  });
}

/* Reports */
export const useReports = () => useQuery({ queryKey: ["reports"], queryFn: api.getReports });
export const useReportTypes = () => useQuery({ queryKey: ["reporttypes"], queryFn: api.getReportTypes });

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (report: Pick<Report, "title" | "type" | "period">) => api.generateReport(report),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export const useScheduledReports = () => useQuery({ queryKey: ["scheduled"], queryFn: api.getScheduledReports });

export function useAddScheduledReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: Pick<ScheduledReport, "name" | "freq" | "recipients">) => api.addScheduledReport(s),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scheduled"] }),
  });
}

export function useUpdateScheduledReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ScheduledReport> }) =>
      api.updateScheduledReport(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scheduled"] }),
  });
}

/* Admin */
export const useTeam = () => useQuery({ queryKey: ["team"], queryFn: api.getTeam });

export function useInviteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (member: { name: string; email: string; role: TeamUser["role"] }) => api.inviteTeamMember(member),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });
}

export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<TeamUser, "name" | "email" | "role">> }) =>
      api.updateTeamMember(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });
}

export const useIntegrations = () => useQuery({ queryKey: ["integrations"], queryFn: api.getIntegrations });

export function useUpdateIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Integration, "status" | "detail">> }) =>
      api.updateIntegration(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });
}

export const useAuditLogs = () => useQuery({ queryKey: ["audit"], queryFn: api.getAuditLogs });

/* Auth */
export const useMe = () => useQuery({ queryKey: ["me"], queryFn: api.getMe });

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Pick<TeamUser, "name" | "email">>) => api.updateMe(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}
