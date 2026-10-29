import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Prova gratis", alternates: { canonical: "/registre" } };

export default async function Page({ searchParams }: PageProps<"/registre">) {
  const sp = await searchParams;
  const promo = typeof sp.descompte === "string" ? sp.descompte.replace(/[^A-Z0-9_-]/gi, "") : null;
  return (
    <AuthShell title="La primera correcció és gratis" subtitle="Crea el compte i en dos minuts tens la nota de la teva redacció.">
      {sp.convidat && (
        <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          🎁 T&apos;han convidat! Quan facis la primera correcció, en guanyaràs <b>una altra de gratis</b>.
        </p>
      )}
      {promo && (
        <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          🎟️ Codi <b>{promo}</b> guardat: el descompte s&apos;aplicarà sol quan compris.
        </p>
      )}
      <AuthForm action={signUp} submit="Crear compte i corregir" />
      <p className="mt-4 text-center text-sm text-stone-600">
        Ja tens compte? <Link href="/entrar" className="font-medium text-brand hover:underline">Entra</Link>
      </p>
      <p className="mt-3 text-center text-xs text-stone-500">
        En registrar-te acceptes les <Link href="/legal" className="underline">condicions i la política de privacitat</Link>.
      </p>
    </AuthShell>
  );
}
