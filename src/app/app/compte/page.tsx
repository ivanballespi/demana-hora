import { CONTACT_EMAIL } from "@/lib/site";
import { changePassword } from "@/app/app/actions";
import { StateForm } from "@/components/StateForm";
import { requireUser } from "@/lib/account";

export const metadata = { title: "Compte" };

export default async function Page() {
  const user = await requireUser();
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
        Factures, dubtes o problemes: <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </div>
  );
}
