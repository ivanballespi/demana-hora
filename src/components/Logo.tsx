import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
          <path d="M20 33l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      Senyal
    </Link>
  );
}
