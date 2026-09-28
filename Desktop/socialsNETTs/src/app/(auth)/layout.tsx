import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";
import { Avatar } from "@/components/ui/Avatar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[46%_1fr]">
      {/* brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--color-border)] bg-[linear-gradient(160deg,#1a1735,#0c0d18)] p-12 text-white lg:flex">
        <Link href="/" className="relative flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[16px] font-semibold">socialNET</span>
        </Link>
        <div className="relative">
          <p className="max-w-[420px] text-[24px] font-medium leading-[1.4] tracking-[-0.02em]">
            “socialNET caught a recall rumor 40 minutes before it trended. We had a response out before most people ever saw it.”
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar initials="PA" size="md" />
            <div>
              <div className="text-[14px] font-medium">Ochiengs Moses</div>
              <div className="text-[12px] text-white/60">Head of Brand Reputation, Vela</div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,.3),transparent_70%)]" />
      </div>

      {/* form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-[360px]">{children}</div>
      </div>
    </div>
  );
}
