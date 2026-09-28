from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter(trailing_slash=False)
router.register(r"mentions", views.MentionViewSet, basename="mentions")
router.register(r"crises", views.CrisisViewSet, basename="crises")
router.register(r"alert-rules", views.AlertRuleViewSet, basename="alert-rules")
router.register(r"integrations", views.IntegrationViewSet, basename="integrations")
router.register(r"team", views.TeamViewSet, basename="team")
router.register(r"reports", views.ReportViewSet, basename="reports")
router.register(r"scheduled-reports", views.ScheduledReportViewSet, basename="scheduled-reports")

urlpatterns = [
    path("kpis", views.KpisView.as_view()),
    path("brand-health", views.BrandHealthView.as_view()),
    path("mention-volume", views.MentionVolumeView.as_view()),
    path("engagement-series", views.EngagementSeriesView.as_view()),
    path("sentiment-distribution", views.SentimentDistributionView.as_view()),
    path("platform-breakdown", views.PlatformBreakdownView.as_view()),
    path("trends", views.TrendsView.as_view()),
    path("live-feed", views.LiveFeedView.as_view()),
    path("hashtags", views.HashtagsView.as_view()),
    path("sentiment-bars", views.SentimentBarsView.as_view()),
    path("platform-comparison", views.PlatformComparisonView.as_view()),
    path("influencers", views.InfluencerListView.as_view()),
    path("alerts", views.AlertListView.as_view()),
    path("assistant", views.AssistantView.as_view()),
    path("post-analysis", views.PostAnalysisView.as_view()),
    path("report-types", views.ReportTypesView.as_view()),
    path("audit-logs", views.AuditLogListView.as_view()),
] + router.urls
