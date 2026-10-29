import { changePassword } from "@/app/panell/actions";
import { StateForm } from "@/components/StateForm";
import { requireBusiness } from "@/lib/business";

export const metadata = { title: "Compte" };

export default async function Page() {
  const { user } = await requireBusiness();
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Compte</h1>
      <p className="text-sm text-stone-600">Has entrat com a <b>{user.email}</b>.</p>
      <div className="card">
        <h2 className="mb-4 font-semibold">Canviar la contrasenya</h2>
        <StateForm action={changePassword} submit="Canviar">
          <input className="input" type="password" name="password" minLength={8} required placeholder="Nova contrasenya" autoComplete="new-password" />
        </StateForm>
      </div>
      <p className="text-sm text-stone-600">
        Dubtes o problemes? Escriu-nos a <a className="underline" href="mailto:hola@senyal.cat">hola@senyal.cat</a> i et responem el mateix dia.
      </p>
    </div>
  );
}
