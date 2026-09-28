import { cn, initials as toInitials } from "@/lib/utils";

const sizes = { xs: "h-6 w-6 text-[9px]", sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm", xl: "h-16 w-16 text-lg" } as const;

export function Avatar({
  src,
  name,
  initials,
  color,
  size = "md",
  className,
}: {
  src?: string;
  name?: string;
  initials?: string;
  color?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const label = initials ?? (name ? toInitials(name) : "?");
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white",
        sizes[size],
        className,
      )}
      style={{ background: color ?? "linear-gradient(135deg,#6366f1,#a855f7)" }}
    >
      {src ? <img src={src} alt={name ?? ""} className="h-full w-full object-cover" /> : label}
    </span>
  );
}
