import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";
import { getProfile, hasPass, requireUser } from "@/lib/account";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const badge = hasPass(profile)
    ? "Il·limitat"
    : `${profile.credits} ${profile.credits === 1 ? "correcció" : "correccions"}`;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo href="/app" />
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            <Link href="/app/nova" className="btn-primary py-1.5">+ Nova correcció</Link>
            <Link href="/app" className="rounded-lg px-3 py-1.5 font-medium text-stone-700 hover:bg-stone-100">Historial</Link>
            <Link href="/app/preus" className="rounded-lg bg-brand-soft px-3 py-1.5 font-semibold text-brand">{badge}</Link>
            <Link href="/app/compte" className="rounded-lg px-3 py-1.5 text-stone-700 hover:bg-stone-100">Compte</Link>
            <form action={signOut}>
              <button className="rounded-lg px-3 py-1.5 text-stone-500 hover:bg-stone-100">Sortir</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
