from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from intel.models import (
    Alert, AlertRule, AuditLog, Crisis, Integration, Influencer, Mention, Report, ScheduledReport, TeamUser,
)

User = get_user_model()

# Dev-only shared password for every seeded demo account — never used outside
# local development, where the whole DB is disposable/reseedable anyway.
DEMO_PASSWORD = "vela-demo-2026"

MENTIONS = [
    {
        "id": "m1", "platform": "twitter",
        "author_name": "Maren Cole", "author_handle": "@tech_maren", "author_initials": "MC", "author_color": "#6366f1", "author_followers": "418K", "author_verified": True,
        "content": "Vela Yuzu is genuinely the best drink I’ve had all year. The adaptogen blend actually does something for my afternoon slump. Obsessed is an understatement.",
        "time": "38m", "sentiment": "positive", "priority": "high", "reach": "2.1M", "likes": "12.4K", "comments": "842", "shares": "2.1K",
        "region": "North America", "status": "new", "confidence": 96,
        "emotions": [{"k": "Joy", "v": 74}, {"k": "Trust", "v": 58}, {"k": "Anticipation", "v": 31}],
        "topics": ["#VelaGlow", "Yuzu flavor", "energy", "afternoon slump"],
        "suggested_reply": "Maren, this absolutely made our day 💛 The Yuzu was a labor of love. Mind if we share this with our team? You just described exactly why we built Vela.",
    },
    {
        "id": "m2", "platform": "reddit",
        "author_name": "u/glow_chemist", "author_handle": "r/skincareaddiction", "author_initials": "GC", "author_color": "#f97316", "author_followers": "2.4M sub", "author_verified": False,
        "content": "Is the Vela recall rumor actually true? Saw a thread claiming the Berry batch has a contamination issue. Has anyone seen an official source, or is this just fear-mongering?",
        "time": "14m", "sentiment": "negative", "priority": "critical", "reach": "240K", "likes": "1.2K", "comments": "380", "shares": "—",
        "region": "North America", "status": "assigned", "assignee": "Marcus L.", "confidence": 91,
        "emotions": [{"k": "Fear", "v": 62}, {"k": "Anticipation", "v": 48}, {"k": "Distrust", "v": 44}],
        "topics": ["product recall", "Berry batch", "contamination", "safety"],
        "suggested_reply": "Hi — there is no recall. The Berry batch passed all third-party safety tests (results here). We take this seriously and are happy to answer any questions directly.",
        "notes": [{"author": "Marcus Lee", "text": "Escalated to Crisis — drafting holding statement.", "at": "12m ago"}],
    },
    {
        "id": "m3", "platform": "instagram",
        "author_name": "Ava Glow", "author_handle": "@glowwithava", "author_initials": "AG", "author_color": "#a855f7", "author_followers": "92K", "author_verified": True,
        "content": "Vela restock just dropped 🙌 run don’t walk — the Yuzu sells out in literal minutes every single time.",
        "time": "21m", "sentiment": "positive", "priority": "medium", "reach": "410K", "likes": "8.9K", "comments": "212", "shares": "440",
        "region": "Europe", "status": "new", "confidence": 88,
        "emotions": [{"k": "Joy", "v": 68}, {"k": "Anticipation", "v": 55}],
        "topics": ["restock", "Yuzu", "scarcity"],
        "suggested_reply": "The early-access list exists for exactly this 😅 DM us and we’ll get you on it before the next drop.",
    },
    {
        "id": "m4", "platform": "news",
        "author_name": "TechCrunch", "author_handle": "@techcrunch", "author_initials": "TC", "author_color": "#64748b", "author_followers": "12.1M", "author_verified": True,
        "content": "Vela raises $40M Series B to expand its adaptogen beverage line into European markets, led by Northstar Ventures.",
        "time": "1h", "sentiment": "neutral", "priority": "low", "reach": "1.8M", "likes": "640", "comments": "88", "shares": "310",
        "region": "North America", "status": "new", "confidence": 82,
        "emotions": [{"k": "Anticipation", "v": 40}, {"k": "Trust", "v": 33}],
        "topics": ["Series B", "funding", "Europe", "expansion"],
        "suggested_reply": "Thanks for the coverage. Happy to connect you with our founder for a follow-up on the European rollout.",
    },
    {
        "id": "m5", "platform": "twitter",
        "author_name": "Daily Health Nut", "author_handle": "@dailyhealthnut", "author_initials": "DH", "author_color": "#6366f1", "author_followers": "88K", "author_verified": False,
        "content": "why is there so much sugar in Vela tho?? 19g for a “wellness” drink is wild. love the branding, hate the label.",
        "time": "1h", "sentiment": "mixed", "priority": "medium", "reach": "320K", "likes": "3.2K", "comments": "540", "shares": "180",
        "region": "North America", "status": "new", "confidence": 85,
        "emotions": [{"k": "Disappointment", "v": 51}, {"k": "Surprise", "v": 39}],
        "topics": ["sugar content", "nutrition label", "wellness"],
        "suggested_reply": "Fair callout — our Zero line is 2g sugar and we’re reformulating the core range for Q3. Appreciate you keeping us honest.",
    },
    {
        "id": "m6", "platform": "tiktok",
        "author_name": "Sarah K", "author_handle": "@sarah.k.wellness", "author_initials": "SK", "author_color": "#22d3ee", "author_followers": "214K", "author_verified": False,
        "content": "the Vela morning routine that actually changed my energy levels (and no this isn’t sponsored, I bought all 6 flavors myself)",
        "time": "2h", "sentiment": "positive", "priority": "medium", "reach": "680K", "likes": "24K", "comments": "1.1K", "shares": "3.4K",
        "region": "North America", "status": "new", "confidence": 90,
        "emotions": [{"k": "Joy", "v": 71}, {"k": "Trust", "v": 62}],
        "topics": ["morning routine", "energy", "authentic"],
        "suggested_reply": "Not sponsored and still this kind 🥹 thank you Sarah. Which flavor made the cut as your daily?",
    },
    {
        "id": "m7", "platform": "reddit",
        "author_name": "u/honest_reviews", "author_handle": "r/beverages", "author_initials": "HR", "author_color": "#f97316", "author_followers": "880K sub", "author_verified": False,
        "content": "Tried all 6 Vela flavors so you don’t have to — ranked. Yuzu and the Maren collab on top, Berry near the bottom. Solid lineup overall.",
        "time": "3h", "sentiment": "neutral", "priority": "low", "reach": "140K", "likes": "920", "comments": "164", "shares": "—",
        "region": "Europe", "status": "new", "confidence": 79,
        "emotions": [{"k": "Trust", "v": 45}, {"k": "Anticipation", "v": 30}],
        "topics": ["flavor ranking", "Yuzu", "Berry", "review"],
        "suggested_reply": "Love a methodical ranking. Curious where the Maren collab landed for you on sweetness — we get split feedback there.",
    },
    {
        "id": "m8", "platform": "instagram",
        "author_name": "Café Lumen", "author_handle": "@cafe_lumen", "author_initials": "CL", "author_color": "#a855f7", "author_followers": "34K", "author_verified": False,
        "content": "Proud to now carry @drinkvela at all 12 of our locations ✨ stop by for a Yuzu spritz this weekend.",
        "time": "4h", "sentiment": "positive", "priority": "low", "reach": "88K", "likes": "2.1K", "comments": "74", "shares": "90",
        "region": "North America", "status": "resolved", "confidence": 87,
        "emotions": [{"k": "Joy", "v": 66}, {"k": "Trust", "v": 52}],
        "topics": ["retail partner", "locations", "Yuzu spritz"],
        "suggested_reply": "Partners like you are everything 💛 we’ll re-share to our stories this weekend.",
    },
]

INFLUENCERS = [
    {"name": "Maren Cole", "handle": "@tech_maren", "platform": "X", "followers": "418K", "reach": "2.1M", "sentiment": "positive", "score": 94},
    {"name": "Sarah K", "handle": "@sarah.k.wellness", "platform": "TikTok", "followers": "214K", "reach": "680K", "sentiment": "positive", "score": 88},
    {"name": "Ava Glow", "handle": "@glowwithava", "platform": "IG", "followers": "92K", "reach": "410K", "sentiment": "positive", "score": 76},
    {"name": "Daily Health Nut", "handle": "@dailyhealthnut", "platform": "X", "followers": "88K", "reach": "320K", "sentiment": "negative", "score": 61},
]

ALERTS = [
    {"id": "a1", "severity": "critical", "type": "sentiment", "title": "Negative sentiment spike", "description": "Negative mentions rose +218% in a 6-hour window. Recall keyword driving the surge.", "time": "14m ago", "status": "active", "metric": "+218%"},
    {"id": "a2", "severity": "warning", "type": "viral", "title": "Viral post detected", "description": "@tech_maren post crossed 2M reach — 5.0x their follower base. Positive sentiment.", "time": "38m ago", "status": "active", "metric": "2.1M"},
    {"id": "a3", "severity": "warning", "type": "unanswered", "title": "Unanswered high-priority", "description": "37 high-priority mentions past SLA. Reddit recall thread among them.", "time": "1h ago", "status": "acknowledged", "metric": "37 open"},
    {"id": "a4", "severity": "info", "type": "influencer", "title": "Influencer activity", "description": "@dailyhealthnut (88K) posted a negative mention about sugar content.", "time": "1h ago", "status": "active", "metric": "88K"},
    {"id": "a5", "severity": "info", "type": "spike", "title": "Mention volume threshold", "description": "Hourly mentions exceeded 3,000 — 2.4x your normal baseline.", "time": "2h ago", "status": "resolved", "metric": "+140%"},
]

ALERT_RULES = [
    {"id": "r1", "name": "Sentiment crash", "condition": "Negative mentions +200% in 6h", "channels": "In-app · SMS · Slack", "on": True},
    {"id": "r2", "name": "Viral detection", "condition": "Any post > 3.0x follower reach", "channels": "In-app · Email", "on": True},
    {"id": "r3", "name": "Crisis keyword", "condition": '"recall" or "lawsuit" detected', "channels": "In-app · SMS · Slack · Email", "on": True},
    {"id": "r4", "name": "SLA breach", "condition": "High-priority unanswered > 1h", "channels": "In-app · Email", "on": True},
    {"id": "r5", "name": "Competitor mention", "condition": "Brand named with a competitor", "channels": "In-app", "on": False},
]

REPORTS = [
    {"id": "r1", "title": "Monthly Executive — May 2026", "type": "monthly", "period": "May 1–31", "generated": "Jun 1, 9:00 AM", "status": "ready"},
    {"id": "r2", "title": "#VelaGlow Campaign Recap", "type": "campaign", "period": "May 14 – Jun 12", "generated": "Jun 12, 7:30 AM", "status": "ready"},
    {"id": "r3", "title": "Weekly Performance — W23", "type": "weekly", "period": "Jun 2–8", "generated": "Jun 9, 8:00 AM", "status": "ready"},
    {"id": "r4", "title": "Crisis Debrief — Recall Rumor", "type": "incident", "period": "Jun 5–12", "generated": "Generating…", "status": "processing"},
    {"id": "r5", "title": "Daily Summary — Jun 11", "type": "daily", "period": "Jun 11", "generated": "Jun 12, 8:00 AM", "status": "ready"},
]

CRISES = [
    {
        "id": "c1", "title": "Recall rumor", "status": "active", "severity": "SEV-2", "score": 68,
        "opened": "18h ago", "owner": "Ochiengs Moses",
        "summary": "An unverified product-recall rumor about the Berry batch originated in a single Reddit thread, then amplified onto X via three mid-size accounts. 5 accounts now amplifying · 2.8M reach exposed. A holding statement with lab results is live; sentiment is stabilizing.",
        "signals": [
            {"label": "Negative sentiment", "value": "+218%", "sub": "6h velocity", "intent": "critical", "pct": 88},
            {"label": "Recall keyword volume", "value": "3,180", "sub": "+320% vs baseline", "intent": "critical", "pct": 74},
            {"label": "Influencer amplification", "value": "5 accounts", "sub": "2.8M combined reach", "intent": "warning", "pct": 61},
            {"label": "Unanswered high-priority", "value": "37", "sub": "SLA breach risk", "intent": "warning", "pct": 45},
        ],
        "timeline": [
            {"id": "e1", "day": "Yesterday", "time": "14:20", "title": "Rumor originates", "detail": "Single post on r/skincareaddiction alleges Berry-batch contamination.", "dot": "#ef4444", "tag": "Detected by AI", "tagIntent": "info"},
            {"id": "e2", "day": "Yesterday", "time": "15:05", "title": "Auto-alert fired", "detail": "Recall keyword crossed 200% threshold. Crisis team paged via Slack + SMS.", "dot": "#f59e0b", "tag": "System", "tagIntent": "neutral"},
            {"id": "e3", "day": "Yesterday", "time": "15:40", "title": "Amplified onto X", "detail": "@dailyhealthnut (88K) and two others reshare. Reach jumps to 2.8M.", "dot": "#ef4444", "tag": "Escalation", "tagIntent": "critical"},
            {"id": "e4", "day": "Yesterday", "time": "17:10", "title": "Holding statement approved", "detail": "Marcus drafted, Ochiengs approved. Posted to X + Reddit with lab results.", "dot": "#22c55e", "tag": "Ochiengs Moses", "tagIntent": "positive"},
            {"id": "e5", "day": "Today", "time": "09:00", "title": "Sentiment stabilizing", "detail": "Negative velocity down to +40%/h. Monitoring continues.", "dot": "#6366f1", "tag": "In progress", "tagIntent": "info"},
        ],
        "strategies": [
            {"title": "Publish third-party lab results", "desc": "Directly refutes the contamination claim with a verifiable source.", "impact": "High", "recommended": True},
            {"title": "Founder video response", "desc": "Personal, transparent tone tends to recover trust fastest in recall scenarios.", "impact": "High", "recommended": False},
            {"title": "Targeted reply to amplifiers", "desc": "Reach the 5 driving accounts individually before they post again.", "impact": "Medium", "recommended": False},
        ],
        "war_room": [
            {"name": "Ochiengs Moses", "role": "Incident lead", "initials": "PA", "color": "#6366f1", "status": "Online"},
            {"name": "Marcus Lee", "role": "Comms", "initials": "ML", "color": "#a855f7", "status": "Online"},
            {"name": "Dana Ortiz", "role": "Legal review", "initials": "DO", "color": "#f59e0b", "status": "Reviewing"},
            {"name": "Sam Reyes", "role": "Product", "initials": "SR", "color": "#22c55e", "status": "Idle"},
        ],
    },
]

TEAM = [
    {"id": "u1", "name": "Ochiengs Moses", "email": "ochiengs@vela.co", "initials": "OM", "color": "#6366f1", "role": "admin", "status": "active", "last_active": "now"},
    {"id": "u2", "name": "Marcus Lee", "email": "marcus@vela.co", "initials": "ML", "color": "#a855f7", "role": "analyst", "status": "active", "last_active": "12m ago"},
    {"id": "u3", "name": "Dana Ortiz", "email": "dana@vela.co", "initials": "DO", "color": "#f59e0b", "role": "community", "status": "active", "last_active": "1h ago"},
    {"id": "u4", "name": "Sam Reyes", "email": "sam@vela.co", "initials": "SR", "color": "#22c55e", "role": "executive", "status": "active", "last_active": "3h ago"},
    {"id": "u5", "name": "Jordan Pike", "email": "jordan@vela.co", "initials": "JP", "color": "#64748b", "role": "analyst", "status": "invited", "last_active": "pending"},
]

INTEGRATIONS = [
    {"id": "i1", "platform": "twitter", "name": "X / Twitter", "account": "2 accounts", "status": "connected", "detail": "synced 2m ago"},
    {"id": "i2", "platform": "instagram", "name": "Instagram", "account": "@drinkvela", "status": "connected", "detail": "synced 4m ago"},
    {"id": "i3", "platform": "tiktok", "name": "TikTok", "account": "@vela", "status": "connected", "detail": "synced 6m ago"},
    {"id": "i4", "platform": "reddit", "name": "Reddit", "account": "Keyword tracking", "status": "connected", "detail": "active"},
    {"id": "i5", "platform": "youtube", "name": "YouTube", "account": "Vela", "status": "error", "detail": "Token expired · reconnect"},
    {"id": "i6", "platform": "linkedin", "name": "LinkedIn", "account": "—", "status": "disconnected", "detail": "Connect to track mentions"},
]

SCHEDULED_REPORTS = [
    {"id": "s1", "name": "Monthly Executive", "freq": "Monthly · 1st · 9:00 AM", "recipients": "Leadership (4)", "on": True},
    {"id": "s2", "name": "Weekly Performance", "freq": "Weekly · Mon · 8:00 AM", "recipients": "Marketing (8)", "on": True},
    {"id": "s3", "name": "Daily Summary", "freq": "Daily · 8:00 AM", "recipients": "You", "on": True},
]

AUDIT_LOGS = [
    {"id": "l1", "who": "Ochiengs Moses", "initials": "PA", "color": "#6366f1", "action": "approved holding statement", "target": "Crisis #C-2291", "category": "config", "time": "17:10 · Yesterday"},
    {"id": "l2", "who": "Marcus Lee", "initials": "ML", "color": "#a855f7", "action": "changed alert threshold", "target": "Sentiment crash rule", "category": "config", "time": "15:02 · Yesterday"},
    {"id": "l3", "who": "System", "initials": "SY", "color": "#64748b", "action": "auto-escalated incident", "target": "Recall rumor", "category": "system", "time": "15:05 · Yesterday"},
    {"id": "l4", "who": "Dana Ortiz", "initials": "DO", "color": "#f59e0b", "action": "resolved mention", "target": "@cafe_lumen", "category": "data", "time": "11:20 · Yesterday"},
    {"id": "l5", "who": "Ochiengs Moses", "initials": "PA", "color": "#6366f1", "action": "invited user", "target": "jordan@vela.co", "category": "user", "time": "09:44 · Yesterday"},
    {"id": "l6", "who": "Sam Reyes", "initials": "SR", "color": "#22c55e", "action": "exported report", "target": "Monthly executive · May", "category": "data", "time": "16:30 · Jun 10"},
]


class Command(BaseCommand):
    help = "Seed the database with socialNET's Vela demo data."

    def handle(self, *args, **options):
        Mention.objects.all().delete()
        for row in MENTIONS:
            Mention.objects.create(**row)

        Influencer.objects.all().delete()
        for row in INFLUENCERS:
            Influencer.objects.create(**row)

        Alert.objects.all().delete()
        for row in ALERTS:
            Alert.objects.create(**row)

        AlertRule.objects.all().delete()
        for row in ALERT_RULES:
            AlertRule.objects.create(**row)

        Report.objects.all().delete()
        for row in REPORTS:
            Report.objects.create(**row)

        Crisis.objects.all().delete()
        for row in CRISES:
            Crisis.objects.create(**row)

        User.objects.filter(username__in=[row["email"] for row in TEAM]).delete()
        TeamUser.objects.all().delete()
        for row in TEAM:
            user = User.objects.create_user(username=row["email"], email=row["email"], password=DEMO_PASSWORD)
            TeamUser.objects.create(**row, user=user)

        Integration.objects.all().delete()
        for row in INTEGRATIONS:
            Integration.objects.create(**row)

        ScheduledReport.objects.all().delete()
        for row in SCHEDULED_REPORTS:
            ScheduledReport.objects.create(**row)

        AuditLog.objects.all().delete()
        for row in AUDIT_LOGS:
            AuditLog.objects.create(**row)

        self.stdout.write(self.style.SUCCESS("Seeded socialNET demo data."))
        self.stdout.write(f"Demo login: ochiengs@vela.co / {DEMO_PASSWORD}")
