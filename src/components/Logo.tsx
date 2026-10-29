import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-black text-white">A+</span>
      Apte
    </Link>
  );
}
