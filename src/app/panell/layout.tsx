import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/panell", label: "Agenda" },
  { href: "/panell/configuracio", label: "Serveis i horari" },
  { href: "/panell/cobraments", label: "Cobraments i pla" },
  { href: "/panell/compte", label: "Compte" },
];

export default function PanelLayout({ children }: LayoutProps<"/panell">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo href="/panell" />
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">
                {n.label}
              </Link>
            ))}
            <form action={signOut}>
              <button className="rounded-lg px-3 py-1.5 text-stone-500 hover:bg-stone-100">Sortir</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
