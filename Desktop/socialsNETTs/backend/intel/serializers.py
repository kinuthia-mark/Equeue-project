from rest_framework import serializers

from .models import (
    Alert,
    AlertRule,
    AuditLog,
    Crisis,
    Integration,
    Influencer,
    Mention,
    Report,
    ScheduledReport,
    TeamUser,
)


class MentionSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    suggestedReply = serializers.CharField(source="suggested_reply")

    class Meta:
        model = Mention
        fields = [
            "id", "platform", "author", "content", "time", "sentiment", "priority",
            "reach", "likes", "comments", "shares", "region", "status", "assignee",
            "confidence", "emotions", "topics", "suggestedReply", "notes",
        ]

    def get_author(self, obj):
        return {
            "name": obj.author_name,
            "handle": obj.author_handle,
            "avatar": obj.author_avatar,
            "initials": obj.author_initials,
            "color": obj.author_color,
            "followers": obj.author_followers,
            "verified": obj.author_verified,
        }


class InfluencerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Influencer
        fields = ["name", "handle", "platform", "followers", "reach", "sentiment", "score"]


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ["id", "severity", "title", "description", "type", "time", "status", "metric"]


class AlertRuleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = AlertRule
        fields = ["id", "name", "condition", "channels", "on"]


class ReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    generated = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Report
        fields = ["id", "title", "type", "period", "generated", "status", "highlights", "metrics"]


class ScheduledReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = ScheduledReport
        fields = ["id", "name", "freq", "recipients", "on"]


class CrisisSerializer(serializers.ModelSerializer):
    warRoom = serializers.JSONField(source="war_room")

    class Meta:
        model = Crisis
        fields = [
            "id", "title", "status", "severity", "score", "opened", "owner",
            "summary", "signals", "timeline", "strategies", "warRoom",
        ]


class TeamUserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    initials = serializers.CharField(read_only=True)
    color = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)
    lastActive = serializers.CharField(source="last_active", read_only=True)

    class Meta:
        model = TeamUser
        fields = ["id", "name", "email", "initials", "color", "role", "status", "lastActive"]


class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = ["id", "platform", "name", "account", "status", "detail"]


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ["id", "who", "initials", "color", "action", "target", "category", "time"]
