import { resetPassword } from "@/app/auth/actions";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Recuperar contrasenya" };

export default function Page() {
  return (
    <AuthShell title="Recupera l'accés" subtitle="T'enviem un enllaç per entrar i canviar la contrasenya.">
      <AuthForm action={resetPassword} submit="Enviar enllaç" withPassword={false} />
    </AuthShell>
  );
}
