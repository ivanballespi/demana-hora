import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Prova gratis" };

export default function Page() {
  return (
    <AuthShell title="La primera correcció és gratis" subtitle="Crea el compte i en dos minuts tens la nota de la teva redacció.">
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
