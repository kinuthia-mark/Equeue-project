import Link from "next/link";
import { Radio, BarChart3, ShieldAlert, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";

const features = [
  { icon: Radio, title: "Real-time listening", desc: "Track every mention across X, Instagram, TikTok, Reddit, YouTube and news as it happens." },
  { icon: BarChart3, title: "AI sentiment", desc: "Emotion-level analysis on every post, with confidence scores and key-topic extraction." },
  { icon: ShieldAlert, title: "Crisis detection", desc: "Automatic early-warning when sentiment turns, with response plans and a live war room." },
  { icon: Sparkles, title: "Conversational AI", desc: "Ask anything about your data and get source-backed answers and recommended actions." },
];

const stats = [
  { v: "48M+", l: "mentions processed daily" },
  { v: "40min", l: "avg crisis lead time" },
  { v: "12", l: "platforms connected" },
  { v: "400+", l: "brands protected" },
];

const heroKpis = [
  { l: "Mentions", v: "48.2K", d: "+12.4%", c: "var(--color-positive)" },
  { l: "Reach", v: "12.4M", d: "+8.1%", c: "var(--color-positive)" },
  { l: "Sentiment", v: "62%", d: "−4pt", c: "var(--color-warning)" },
  { l: "Response", v: "87%", d: "+5pt", c: "var(--color-positive)" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1100px_600px_at_50%_-8%,rgba(79,70,229,.22),transparent_70%)]">
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center gap-2.5 px-7 py-5">
        <LogoMark />
        <span className="text-[16px] font-semibold tracking-[-0.02em]">socialNET</span>
        <nav className="ml-9 hidden gap-6 text-[13.5px] text-[var(--color-muted)] md:flex">
          <span>Platform</span><span>Solutions</span><span>Customers</span><span>Pricing</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="px-3.5 py-2 text-[13.5px] text-[var(--color-muted)] hover:text-[var(--color-ink)]">Sign in</Link>
          <Link href="/dashboard" className="rounded-[9px] bg-[var(--color-primary)] px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-[var(--color-primary-hover)]">Get started</Link>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-[1000px] px-7 pt-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,.28)] bg-[rgba(99,102,241,.12)] px-3.5 py-1.5 text-[12px] text-[var(--color-primary-ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8] live-dot" /> AI social intelligence · now with live crisis detection
        </div>
        <h1 className="text-[clamp(38px,7vw,62px)] font-semibold leading-[1.02] tracking-[-0.04em]">
          Understand every conversation<br className="hidden sm:block" /> about your brand.
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[19px] leading-[1.55] text-[var(--color-muted)]">
          socialNET listens across every platform in real time, reads sentiment with AI, and warns you the moment a story turns — so your team acts before it escalates.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="rounded-[11px] bg-[var(--color-primary)] px-6 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,.7)] hover:bg-[var(--color-primary-hover)]">Open the platform →</Link>
          <Link href="/login" className="rounded-[11px] border border-[var(--color-border-strong)] bg-[var(--color-subtle)] px-6 py-3.5 text-[15px] font-medium hover:bg-[var(--color-subtle-2)]">Book a demo</Link>
        </div>
        <p className="mono mt-[18px] text-[12px] text-[var(--color-faint)]">Trusted by reputation teams at 400+ consumer brands</p>
      </section>

      {/* product preview */}
      <section className="mx-auto mt-12 max-w-[1080px] px-7">
        <div className="overflow-hidden rounded-t-[18px] border border-b-0 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_-8px_80px_-20px_rgba(79,70,229,.35)]">
          <div className="flex h-10 items-center gap-1.5 border-b border-[var(--color-border)] px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" /><span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            <span className="mono mx-auto text-[11px] text-[var(--color-faint)]">app.socialnet.io/overview</span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {heroKpis.map((k) => (
              <div key={k.l} className="card p-[13px_15px]">
                <div className="mb-1.5 text-[11px] text-[var(--color-faint)]">{k.l}</div>
                <div className="mono text-[21px] font-semibold">{k.v}</div>
                <div className="mono mt-1 text-[11px]" style={{ color: k.c }}>{k.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-[1080px] px-7 pt-24">
        <div className="mb-10 text-center">
          <div className="mono mb-3 text-[12px] tracking-[0.08em] text-[var(--color-primary-ink)]">ONE PLATFORM</div>
          <h2 className="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em]">Listen, analyze, respond, protect</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card p-[22px] transition-transform hover:-translate-y-1">
                <span className="mb-4 grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]"><Icon className="h-[18px] w-[18px]" /></span>
                <div className="mb-2 text-[16px] font-semibold">{f.title}</div>
                <div className="text-[13px] leading-[1.55] text-[var(--color-muted)]">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto mt-[70px] grid max-w-[1080px] grid-cols-2 gap-5 border-y border-[var(--color-border)] px-7 py-8 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l}><div className="mono text-[clamp(26px,4vw,34px)] font-semibold tracking-[-0.02em]">{s.v}</div><div className="mt-1.5 text-[13px] text-[var(--color-faint)]">{s.l}</div></div>
        ))}
      </section>

      {/* cta */}
      <section className="mx-auto max-w-[760px] px-7 py-24 text-center">
        <h2 className="mb-4 text-[clamp(30px,5vw,40px)] font-semibold tracking-[-0.03em]">See what they’re saying — before it’s a headline.</h2>
        <Link href="/dashboard" className="inline-block rounded-[11px] bg-[var(--color-primary)] px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,.7)]">Open the platform →</Link>
      </section>

      <footer className="mx-auto flex max-w-[1080px] items-center border-t border-[var(--color-border)] px-7 py-7 text-[12px] text-[var(--color-faint)]">
        <span>© 2026 socialNET</span><span className="mono ml-auto">Built for reputation teams</span>
      </footer>
    </div>
  );
}
