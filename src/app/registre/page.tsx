import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Prova gratis" };

export default function Page() {
  return (
    <AuthShell title="Prova Senyal 14 dies gratis" subtitle="Sense targeta. En 5 minuts tens la pàgina de reserves a punt.">
      <AuthForm action={signUp} submit="Crear el meu compte" />
      <p className="mt-4 text-center text-sm text-stone-600">
        Ja tens compte? <Link href="/entrar" className="font-medium text-brand hover:underline">Entra</Link>
      </p>
      <p className="mt-3 text-center text-xs text-stone-500">
        En registrar-te acceptes les <Link href="/legal" className="underline">condicions i la política de privacitat</Link>.
      </p>
    </AuthShell>
  );
}
