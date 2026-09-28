import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)] bg-clip-text text-6xl font-black text-transparent">
        404
      </span>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-sm text-[var(--color-muted)]">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link href="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
