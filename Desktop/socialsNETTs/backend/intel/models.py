from django.conf import settings
from django.db import models


class Mention(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    platform = models.CharField(max_length=20)
    author_name = models.CharField(max_length=120)
    author_handle = models.CharField(max_length=120)
    author_avatar = models.CharField(max_length=255, blank=True, default="")
    author_initials = models.CharField(max_length=4)
    author_color = models.CharField(max_length=20)
    author_followers = models.CharField(max_length=40)
    author_verified = models.BooleanField(default=False)
    content = models.TextField()
    time = models.CharField(max_length=20)
    sentiment = models.CharField(max_length=20)
    priority = models.CharField(max_length=20)
    reach = models.CharField(max_length=20)
    likes = models.CharField(max_length=20)
    comments = models.CharField(max_length=20)
    shares = models.CharField(max_length=20)
    region = models.CharField(max_length=60)
    status = models.CharField(max_length=20)
    assignee = models.CharField(max_length=120, blank=True, null=True)
    confidence = models.IntegerField()
    emotions = models.JSONField(default=list)
    topics = models.JSONField(default=list)
    suggested_reply = models.TextField()
    notes = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.author_handle}: {self.content[:40]}"


class Influencer(models.Model):
    name = models.CharField(max_length=120)
    handle = models.CharField(max_length=120)
    platform = models.CharField(max_length=20)
    followers = models.CharField(max_length=20)
    reach = models.CharField(max_length=20)
    sentiment = models.CharField(max_length=20)
    score = models.IntegerField()

    class Meta:
        ordering = ["-score"]

    def __str__(self):
        return self.handle


class Alert(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    severity = models.CharField(max_length=20)
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20)
    time = models.CharField(max_length=40)
    status = models.CharField(max_length=20)
    metric = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class AlertRule(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=120)
    condition = models.CharField(max_length=200)
    channels = models.CharField(max_length=120)
    on = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Report(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=20)
    period = models.CharField(max_length=60)
    generated = models.CharField(max_length=60)
    status = models.CharField(max_length=20)
    highlights = models.JSONField(default=list, blank=True)
    metrics = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class Crisis(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20)
    severity = models.CharField(max_length=20)
    score = models.IntegerField()
    opened = models.CharField(max_length=40)
    owner = models.CharField(max_length=120)
    summary = models.TextField()
    signals = models.JSONField(default=list)
    timeline = models.JSONField(default=list)
    strategies = models.JSONField(default=list)
    war_room = models.JSONField(default=list)

    class Meta:
        ordering = ["id"]
        verbose_name_plural = "crises"

    def __str__(self):
        return self.title


class TeamUser(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    initials = models.CharField(max_length=4)
    color = models.CharField(max_length=20)
    role = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    last_active = models.CharField(max_length=40)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="profile",
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Integration(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    platform = models.CharField(max_length=20)
    name = models.CharField(max_length=120)
    account = models.CharField(max_length=120)
    status = models.CharField(max_length=20)
    detail = models.CharField(max_length=120)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class ScheduledReport(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    name = models.CharField(max_length=120)
    freq = models.CharField(max_length=60)
    recipients = models.CharField(max_length=120)
    on = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class AuditLog(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    who = models.CharField(max_length=120)
    initials = models.CharField(max_length=4)
    color = models.CharField(max_length=20)
    action = models.CharField(max_length=200)
    target = models.CharField(max_length=200)
    category = models.CharField(max_length=20)
    time = models.CharField(max_length=60)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.who} {self.action}"
