import io
import time
import uuid

from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from . import mock_data
from .models import (
    Alert, AlertRule, AuditLog, Crisis, Integration, Influencer, Mention, Report, ScheduledReport, TeamUser,
)
from .serializers import (
    AlertRuleSerializer,
    AlertSerializer,
    AuditLogSerializer,
    CrisisSerializer,
    IntegrationSerializer,
    InfluencerSerializer,
    MentionSerializer,
    ReportSerializer,
    ScheduledReportSerializer,
    TeamUserSerializer,
)


class KpisView(APIView):
    def get(self, request):
        return Response(mock_data.KPIS)


class BrandHealthView(APIView):
    def get(self, request):
        return Response(mock_data.BRAND_HEALTH)


class MentionVolumeView(APIView):
    def get(self, request):
        range_key = request.query_params.get("range", "7d")
        days = mock_data.RANGE_DAYS.get(range_key, 14)
        return Response(mock_data.mention_volume(days))


class EngagementSeriesView(APIView):
    def get(self, request):
        range_key = request.query_params.get("range", "7d")
        return Response(mock_data.engagement_series(range_key))


class SentimentDistributionView(APIView):
    def get(self, request):
        return Response(mock_data.SENTIMENT_DISTRIBUTION)


class PlatformBreakdownView(APIView):
    def get(self, request):
        return Response(mock_data.PLATFORM_BREAKDOWN)


class TrendsView(APIView):
    def get(self, request):
        return Response(mock_data.TRENDS)


class LiveFeedView(APIView):
    def get(self, request):
        return Response(mock_data.LIVE_FEED)


class HashtagsView(APIView):
    def get(self, request):
        return Response(mock_data.HASHTAGS)


class SentimentBarsView(APIView):
    def get(self, request):
        return Response(mock_data.SENTIMENT_BARS)


class PlatformComparisonView(APIView):
    def get(self, request):
        return Response(mock_data.PLATFORM_COMPARISON)


class ReportTypesView(APIView):
    def get(self, request):
        return Response(mock_data.REPORT_TYPES)


class AssistantView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt", "")
        message_id = f"a_{int(time.time() * 1000)}"
        return Response(mock_data.assistant_reply(prompt, message_id))


class PostAnalysisView(APIView):
    def post(self, request):
        url = request.data.get("url") or mock_data.SAMPLE_POST_ANALYSIS["url"]
        return Response({**mock_data.SAMPLE_POST_ANALYSIS, "url": url})


class InfluencerListView(ListAPIView):
    queryset = Influencer.objects.all()
    serializer_class = InfluencerSerializer


class AlertListView(ListAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer


class AuditLogListView(ListAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer


def _short_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


class MentionViewSet(viewsets.ModelViewSet):
    queryset = Mention.objects.all()
    serializer_class = MentionSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def _append_note(self, mention, author, text):
        notes = list(mention.notes or [])
        notes.append({"author": author, "text": text, "at": "just now"})
        mention.notes = notes

    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        mention = self.get_object()
        text = request.data.get("text", "").strip()
        if text:
            self._append_note(mention, "You", text)
        mention.status = "assigned"
        mention.save()
        return Response(self.get_serializer(mention).data)

    @action(detail=True, methods=["post"])
    def notes(self, request, pk=None):
        mention = self.get_object()
        text = request.data.get("text", "").strip()
        author = request.data.get("author") or "Ochiengs Moses"
        if text:
            self._append_note(mention, author, text)
            mention.save()
        return Response(self.get_serializer(mention).data)


class CrisisViewSet(viewsets.ModelViewSet):
    queryset = Crisis.objects.all()
    serializer_class = CrisisSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    @action(detail=True, methods=["post"])
    def events(self, request, pk=None):
        crisis = self.get_object()
        timeline = list(crisis.timeline or [])
        timeline.append({
            "id": _short_id("e"),
            "day": "Today",
            "time": request.data.get("time", ""),
            "title": request.data.get("title", "Update"),
            "detail": request.data.get("detail", ""),
            "dot": request.data.get("dot", "#6366f1"),
            "tag": request.data.get("tag", "Ochiengs Moses"),
            "tagIntent": request.data.get("tagIntent", "info"),
        })
        crisis.timeline = timeline
        crisis.save()
        return Response(self.get_serializer(crisis).data)


class AlertRuleViewSet(viewsets.ModelViewSet):
    queryset = AlertRule.objects.all()
    serializer_class = AlertRuleSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def perform_create(self, serializer):
        serializer.save(id=_short_id("r"))


class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    serializer_class = IntegrationSerializer
    http_method_names = ["get", "patch", "head", "options"]


class TeamViewSet(viewsets.ModelViewSet):
    queryset = TeamUser.objects.all()
    serializer_class = TeamUserSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def perform_create(self, serializer):
        name = serializer.validated_data.get("name", "")
        initials = "".join(p[0] for p in name.split()[:2]).upper() or "NA"
        colors = ["#6366f1", "#a855f7", "#f59e0b", "#22c55e", "#64748b", "#22d3ee"]
        serializer.save(
            id=_short_id("u"),
            initials=initials,
            color=colors[hash(name) % len(colors)],
            status="invited",
            last_active="pending",
        )


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    http_method_names = ["get", "post", "head", "options"]

    def perform_create(self, serializer):
        title = serializer.validated_data.get("title") or "On-demand report"
        serializer.save(
            id=_short_id("rep"),
            title=title,
            generated="Just now",
            status="ready",
        )

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        report = self.get_object()
        buffer = _render_report_pdf(report)
        return FileResponse(
            buffer, as_attachment=True, filename=f"{report.title}.pdf", content_type="application/pdf",
        )


def _render_report_pdf(report):
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - inch

    c.setFont("Helvetica-Bold", 18)
    c.drawString(inch, y, report.title)
    y -= 0.35 * inch

    c.setFont("Helvetica", 11)
    for line in [
        f"Type: {report.type.title()}",
        f"Period: {report.period}",
        f"Generated: {report.generated}",
        f"Status: {report.status}",
    ]:
        c.drawString(inch, y, line)
        y -= 0.25 * inch

    if report.highlights:
        y -= 0.15 * inch
        c.setFont("Helvetica-Bold", 13)
        c.drawString(inch, y, "Highlights")
        y -= 0.25 * inch
        c.setFont("Helvetica", 11)
        for h in report.highlights:
            c.drawString(inch, y, f"- {h}")
            y -= 0.22 * inch

    if report.metrics:
        y -= 0.15 * inch
        c.setFont("Helvetica-Bold", 13)
        c.drawString(inch, y, "Metrics")
        y -= 0.25 * inch
        c.setFont("Helvetica", 11)
        for m in report.metrics:
            c.drawString(inch, y, f"{m.get('label')}: {m.get('value')} ({m.get('delta')})")
            y -= 0.22 * inch

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer


class ScheduledReportViewSet(viewsets.ModelViewSet):
    queryset = ScheduledReport.objects.all()
    serializer_class = ScheduledReportSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def perform_create(self, serializer):
        serializer.save(id=_short_id("s"))
