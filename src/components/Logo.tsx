import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-from via-accent-via to-accent-to">
        <span className="font-mono text-sm font-bold text-black">T</span>
      </span>
      <span className="font-mono text-[15px] font-semibold tracking-tight text-foreground">
        be<span className="gradient-text">T</span>shaped.dev
      </span>
    </Link>
  );
}
