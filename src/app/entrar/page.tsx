import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Entrar", robots: { index: false } };

export default function Page() {
  return (
    <AuthShell title="Entra al teu compte">
      <AuthForm action={signIn} submit="Entrar" />
      <div className="mt-4 flex justify-between text-sm text-stone-600">
        <Link href="/registre" className="hover:underline">Crear compte</Link>
        <Link href="/entrar/recuperar" className="hover:underline">He oblidat la contrasenya</Link>
      </div>
    </AuthShell>
  );
}
