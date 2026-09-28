from django.contrib import admin

from .models import (
    Alert, AlertRule, AuditLog, Crisis, Integration, Influencer, Mention, Report, ScheduledReport, TeamUser,
)

admin.site.register(Mention)
admin.site.register(Influencer)
admin.site.register(Alert)
admin.site.register(AlertRule)
admin.site.register(Report)
admin.site.register(Crisis)
admin.site.register(TeamUser)
admin.site.register(Integration)
admin.site.register(ScheduledReport)
admin.site.register(AuditLog)
