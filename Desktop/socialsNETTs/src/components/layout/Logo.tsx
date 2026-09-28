import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-[7px] bg-[#4f46e5] shadow-[0_2px_10px_rgba(79,70,229,.4)]",
        className ?? "h-7 w-7",
      )}
    >
      <span className="block h-[11px] w-[11px] rounded-full border-[2.5px] border-white" />
    </span>
  );
}
