"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { navGroups } from "./nav";
import { LogoMark } from "./Logo";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { useMe } from "@/lib/queries";
import { ROLE_LABELS } from "@/lib/types";

export function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const setPalette = useUI((s) => s.setPaletteOpen);
  const landingScreen = useUI((s) => s.landingScreen);
  const { data: me } = useMe();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-black/50 lg:hidden", mobileOpen ? "block" : "hidden")}
        onClick={onMobileClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[218px] flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)] px-3 py-3.5 transition-transform duration-200 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 pb-4 pt-1">
          <Link href={landingScreen} onClick={onMobileClose} className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-[14.5px] font-semibold tracking-[-0.02em]">socialNET</span>
          </Link>
          <button
            onClick={() => setPalette(true)}
            className="mono ml-auto rounded-md border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-faint)] hover:text-[var(--color-ink)]"
          >
            ⌘K
          </button>
          <button onClick={onMobileClose} className="ml-1 text-[var(--color-faint)] lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-1.5">
              <p className="px-2 pb-1 pt-3.5 text-[10px] font-semibold tracking-[0.07em] text-[var(--color-faint)]">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors",
                          active
                            ? "bg-[var(--color-subtle-2)] font-medium text-[var(--color-ink)]"
                            : "text-[var(--color-muted)] hover:bg-[var(--color-subtle)] hover:text-[var(--color-ink)]",
                        )}
                      >
                        <Icon className={cn("h-[15px] w-[15px] shrink-0", active && "text-[var(--color-primary-ink)]")} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "mono rounded-full px-1.5 text-[10px]",
                              item.critical
                                ? "bg-[var(--color-critical-soft)] text-[var(--color-critical)]"
                                : "bg-[var(--color-track)] text-[var(--color-muted)]",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer user */}
        <div className="mt-2 flex items-center gap-1 border-t border-[var(--color-border)] pt-3">
          <Link
            href="/profile"
            onClick={onMobileClose}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--color-subtle)]"
          >
            <Avatar initials={me?.initials ?? "…"} size="sm" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-medium">{me?.name ?? "Loading…"}</p>
              <p className="truncate text-[10px] text-[var(--color-faint)]">{me ? ROLE_LABELS[me.role] : ""}</p>
            </div>
          </Link>
          <button
            onClick={signOut}
            title="Sign out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-faint)] hover:bg-[var(--color-subtle)] hover:text-[var(--color-critical)]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
