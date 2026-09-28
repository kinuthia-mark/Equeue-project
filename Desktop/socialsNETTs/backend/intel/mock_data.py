# Static dashboard content ported from the frontend's former src/lib/mock/core.ts
# and mock/ai.ts. These are computed/canned aggregates rather than independent
# rows, so they're served directly instead of via the ORM.

KPIS = [
    {"id": "mentions", "label": "Total mentions", "value": "48.2K", "delta": "+12.4%", "intent": "positive", "spark": [3, 3.5, 3.2, 4, 4.3, 5, 5.4, 6.1, 5.8, 7]},
    {"id": "reach", "label": "Est. reach", "value": "12.4M", "delta": "+8.1%", "intent": "positive", "spark": [4, 4.2, 4, 4.6, 4.4, 5, 5.3, 5.1, 5.8, 6]},
    {"id": "engagement", "label": "Engagement", "value": "4.8%", "delta": "+0.6pt", "intent": "positive", "spark": [3, 3.4, 3.2, 3.6, 3.5, 3.9, 4.1, 4.4, 4.6, 4.8]},
    {"id": "positive", "label": "Positive sent.", "value": "62%", "delta": "−4pt", "intent": "warning", "spark": [7, 6.8, 6.9, 6.6, 6.4, 6, 5.6, 6.1, 6.2, 6.2]},
    {"id": "response", "label": "Response rate", "value": "87%", "delta": "+5pt", "intent": "positive", "spark": [5, 5.5, 5.4, 6, 6.3, 6.8, 7.4, 8, 8.4, 8.7]},
]

BRAND_HEALTH = {
    "score": 74,
    "status": "AT RISK",
    "intent": "warning",
    "deltaLabel": "▼ 9 pts this week",
    "drivers": [
        {"label": "Negative sentiment surge", "value": "+6pt", "intent": "critical"},
        {"label": "Viral post on X (@tech_maren)", "value": "2.1M", "intent": "warning"},
        {"label": "New followers this week", "value": "+18.4k", "intent": "positive"},
    ],
}

_TOTAL = [1.1, 1.3, 1.2, 1.5, 1.4, 1.8, 2.1, 1.9, 2.3, 2.0, 2.4, 2.8, 3.1, 2.6, 2.9, 4.3, 3.9, 3.4, 4.1, 3.6, 3.2, 3.8, 4.4, 4.0, 3.7, 4.2, 4.9, 4.5, 5.1, 4.8]
_NEG = [0.2, 0.3, 0.2, 0.3, 0.3, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.6, 0.7, 0.6, 0.7, 2.1, 1.6, 1.1, 0.9, 0.8, 0.7, 0.9, 1.0, 0.9, 0.8, 0.9, 1.1, 1.0, 1.2, 1.1]
_DAYS = ["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20", "May 21", "May 22", "May 23", "May 24", "May 25", "May 26", "May 27", "May 28", "May 29", "May 30", "May 31", "Jun 1", "Jun 2", "Jun 3", "Jun 4", "Jun 5", "Jun 6", "Jun 7", "Jun 8", "Jun 9", "Jun 10", "Jun 11", "Jun 12"]

_ENGAGEMENT_MULT = [58, 62, 60, 68, 65, 74, 82, 78, 88, 84, 92, 101, 110, 96, 104, 150, 140, 124, 138, 128, 118, 132, 150, 142, 134, 146, 168, 158, 176, 170]

RANGE_DAYS = {"today": 8, "7d": 14, "30d": 30, "90d": 30, "custom": 30}


def mention_volume(days: int):
    start = max(0, len(_TOTAL) - days)
    out = []
    for i, m in enumerate(_TOTAL[start:]):
        idx = start + i
        out.append({
            "date": _DAYS[idx],
            "mentions": round(m * 1000),
            "positive": round((m - _NEG[idx]) * 1000),
            "negative": round(_NEG[idx] * 1000),
        })
    return out


def engagement_series(range_key: str):
    days = RANGE_DAYS.get(range_key, 14)
    vol = mention_volume(days)
    v = _ENGAGEMENT_MULT
    offset = len(v) - len(vol)
    return [{"date": p["date"], "interactions": v[offset + i] * 1000} for i, p in enumerate(vol)]


SENTIMENT_DISTRIBUTION = [
    {"name": "Positive", "value": 62, "color": "var(--color-positive)"},
    {"name": "Neutral", "value": 24, "color": "var(--color-neutral)"},
    {"name": "Negative", "value": 14, "color": "var(--color-critical)"},
]

PLATFORM_BREAKDOWN = [
    {"platform": "X / Twitter", "mentions": 38, "color": "#6366f1"},
    {"platform": "Instagram", "mentions": 24, "color": "#a855f7"},
    {"platform": "TikTok", "mentions": 18, "color": "#22d3ee"},
    {"platform": "Reddit", "mentions": 11, "color": "#f97316"},
    {"platform": "News / Web", "mentions": 9, "color": "#64748b"},
]

TRENDS = [
    {"rank": "01", "term": "#VelaGlow", "vol": "8.4k", "change": "+218%", "intent": "positive"},
    {"rank": "02", "term": "product recall", "vol": "3.2k", "change": "+320%", "intent": "critical"},
    {"rank": "03", "term": "Vela Yuzu", "vol": "2.9k", "change": "+88%", "intent": "positive"},
    {"rank": "04", "term": '"sugar content"', "vol": "2.1k", "change": "+64%", "intent": "warning"},
]

HASHTAGS = [
    {"tag": "#VelaGlow", "vol": "8,420", "reach": "4.1M", "change": "+218%", "intent": "positive", "spark": [2, 2.4, 2.2, 3, 3.6, 4, 5.2]},
    {"tag": "#YuzuSeason", "vol": "5,210", "reach": "2.2M", "change": "+96%", "intent": "positive", "spark": [1.5, 1.8, 2, 2.1, 2.6, 2.9, 3.1]},
    {"tag": "#VelaXMaren", "vol": "3,940", "reach": "1.9M", "change": "+140%", "intent": "positive", "spark": [0.6, 0.9, 1.2, 1.5, 1.9, 2.3, 2.6]},
    {"tag": "#WellnessDrink", "vol": "2,680", "reach": "1.1M", "change": "+22%", "intent": "positive", "spark": [1.6, 1.7, 1.7, 1.8, 1.9, 2, 2.1]},
    {"tag": "#VelaRecall", "vol": "1,980", "reach": "2.8M", "change": "+320%", "intent": "critical", "spark": [0.3, 0.4, 0.5, 1, 2.2, 2.9, 3.3]},
]

_SENT_POS = [62, 58, 64, 61, 66, 63, 60, 57, 59, 55, 42, 48, 54, 62]
_SENT_NEG = [14, 16, 12, 15, 11, 13, 15, 17, 16, 19, 38, 30, 22, 14]
SENTIMENT_BARS = [
    {"week": f"W{i + 1}", "positive": pos, "neutral": 100 - pos - _SENT_NEG[i], "negative": _SENT_NEG[i]}
    for i, pos in enumerate(_SENT_POS)
]

PLATFORM_COMPARISON = [
    {"platform": "X / Twitter", "mentions": 38, "engagement": 52},
    {"platform": "Instagram", "mentions": 24, "engagement": 31},
    {"platform": "TikTok", "mentions": 18, "engagement": 44},
    {"platform": "Reddit", "mentions": 11, "engagement": 9},
    {"platform": "News", "mentions": 9, "engagement": 6},
]

LIVE_FEED = [
    {"platform": "twitter", "text": "\"Vela Yuzu is genuinely the best drink I’ve had all year\"", "meta": "@tech_maren · X · 12.4K likes · 38m", "sentiment": "positive"},
    {"platform": "reddit", "text": "Is the Vela recall rumor actually true? Seeing this everywhere", "meta": "r/skincareaddiction · Reddit · 14m", "sentiment": "negative"},
    {"platform": "instagram", "text": "Vela restock just dropped, run don’t walk", "meta": "@glowwithava · Instagram · 21m", "sentiment": "positive"},
    {"platform": "news", "text": "Vela raises $40M Series B to expand adaptogen line", "meta": "TechCrunch · News · 1h", "sentiment": "neutral"},
    {"platform": "twitter", "text": "why is there so much sugar in Vela tho", "meta": "@dailyhealthnut · X · 1h", "sentiment": "mixed"},
]

REPORT_TYPES = [
    {"title": "Daily summary", "desc": "Volume, sentiment & top mentions for the last 24h.", "meta": "Auto · 8:00 AM", "type": "daily"},
    {"title": "Weekly performance", "desc": "Engagement, growth & platform breakdown.", "meta": "Auto · Mondays", "type": "weekly"},
    {"title": "Monthly executive", "desc": "Brand health, KPIs & recommendations.", "meta": "Auto · 1st", "type": "monthly"},
    {"title": "Campaign report", "desc": "Full analysis scoped to a campaign or hashtag.", "meta": "On demand", "type": "campaign"},
]

SAMPLE_POST_ANALYSIS = {
    "url": "https://x.com/tech_maren/status/1834500000000000000",
    "platform": "twitter",
    "author": {"name": "Maren Cole", "handle": "@tech_maren", "initials": "MC", "color": "#6366f1", "followers": "418K", "verified": True},
    "content": "Vela Yuzu is genuinely the best drink I’ve had all year. The adaptogen blend actually does something for my afternoon slump. Obsessed is an understatement.",
    "performance": [
        {"label": "Likes", "value": "12.4K", "sub": "+312% vs avg", "intent": "positive"},
        {"label": "Comments", "value": "842", "sub": "+180% vs avg", "intent": "positive"},
        {"label": "Shares", "value": "2.1K", "sub": "+420% vs avg", "intent": "positive"},
        {"label": "Est. reach", "value": "2.1M", "sub": "5.0x follower base", "intent": "positive"},
    ],
    "sentiment": {"positive": 88, "neutral": 9, "negative": 3, "tone": "Joy, Trust"},
    "scores": [
        {"label": "Messaging effectiveness", "value": 92, "intent": "positive"},
        {"label": "Audience resonance", "value": 88, "intent": "positive"},
        {"label": "Brand alignment", "value": 84, "intent": "positive"},
        {"label": "Risk exposure", "value": 12, "intent": "positive"},
    ],
    "positives": ["\"genuinely the best\"", "\"adaptogen blend works\"", "\"obsessed\"", "authentic / unsponsored tone"],
    "risks": ["none detected in top replies"],
    "recommendations": [
        {"icon": "amplify", "title": "Amplify now", "desc": "Boost to lookalike audiences while engagement velocity is high — the next 40 minutes are the viral window."},
        {"icon": "engage", "title": "Engage the author", "desc": "Reply personally and request UGC rights. @tech_maren is your top advocate this week."},
        {"icon": "future", "title": "For future campaigns", "desc": "Yuzu + afternoon-energy framing outperforms generic wellness messaging 2.3:1. Lean in."},
    ],
}

_ASSISTANT_LIBRARY = {
    "Summarize audience sentiment for the last campaign.": {
        "content": "The #VelaGlow campaign netted 62% positive / 24% neutral / 14% negative across 48.2K mentions. Positivity clustered around the Yuzu flavor and the Maren collab; the negative slice is almost entirely the recall rumor, not campaign fatigue. Engagement rate (4.8%) beat your trailing 90-day average by 0.6pt.",
        "cards": [
            {"t": "Net sentiment", "v": "+48", "s": "pos minus neg", "intent": "positive"},
            {"t": "Top driver", "v": "Yuzu flavor", "s": "8.4k mentions", "intent": "positive"},
            {"t": "Engagement", "v": "4.8%", "s": "+0.6pt vs avg", "intent": "positive"},
        ],
        "sources": ["Analytics · Campaign view", "Mentions · #VelaGlow"],
    },
    "Which influencers are driving engagement?": {
        "content": "Three accounts drove 41% of campaign reach. @tech_maren (418K) is your strongest advocate this week with a 2.1M-reach post. @sarah.k.wellness delivered the highest engagement rate at 11.2%. Watch @dailyhealthnut — large reach but currently negative on sugar content.",
        "cards": [
            {"t": "@tech_maren", "v": "2.1M", "s": "reach · positive", "intent": "positive"},
            {"t": "@sarah.k.wellness", "v": "11.2%", "s": "engagement rate", "intent": "positive"},
            {"t": "@dailyhealthnut", "v": "320K", "s": "reach · negative", "intent": "critical"},
        ],
        "sources": ["Engagement · Top creators"],
    },
    "Identify emerging risks for our brand.": {
        "content": "Two risks worth flagging. 1) Recall rumor — still unresolved, 320% volume growth, highest crisis weight. 2) Sugar-content narrative — slower-burning but credible criticism (19g/serving) gaining traction with health-focused accounts. The first is urgent; the second is a reputation/product story for the next planning cycle.",
        "cards": [
            {"t": "Recall rumor", "v": "Critical", "s": "+320% · act now", "intent": "critical"},
            {"t": "Sugar narrative", "v": "Elevated", "s": "+64% · monitor", "intent": "warning"},
        ],
        "sources": ["Crisis Center", "Mentions · \"sugar content\""],
        "action": {"label": "Open Crisis Center", "href": "/crisis"},
    },
    "Suggest strategies to improve engagement.": {
        "content": "Based on what’s performing: 1) Lean into creator-led, unsponsored content — it’s outperforming branded posts 2.3:1 on engagement. 2) Reply faster to positive mentions (your SLA is 1h12m; viral windows close in ~40m). 3) Address the sugar question proactively with the Zero line to convert a negative into a story.",
        "cards": [
            {"t": "Creator content", "v": "2.3:1", "s": "vs branded", "intent": "positive"},
            {"t": "Reply window", "v": "40m", "s": "tighten SLA", "intent": "warning"},
        ],
        "sources": ["Engagement benchmarks"],
    },
}

_ASSISTANT_FALLBACK = {
    "content": "Here’s what stands out in the current data: mention volume is up 12.4% with sentiment under pressure from the recall rumor. I can break this down by platform, audience segment, or time window — just say the word.",
    "cards": [
        {"t": "Mentions", "v": "48.2K", "s": "+12.4%", "intent": "positive"},
        {"t": "Sentiment", "v": "62%", "s": "−4pt", "intent": "warning"},
    ],
    "sources": ["Overview"],
}


def assistant_reply(prompt: str, message_id: str):
    template = _ASSISTANT_LIBRARY.get(prompt, _ASSISTANT_FALLBACK)
    return {"id": message_id, "role": "assistant", **template}
