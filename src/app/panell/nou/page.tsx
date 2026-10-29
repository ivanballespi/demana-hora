import { redirect } from "next/navigation";
import { createBusiness } from "@/app/panell/actions";
import { StateForm } from "@/components/StateForm";
import { currentUser } from "@/lib/business";
import { appUrl } from "@/lib/env";
import { admin } from "@/lib/supabase/admin";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  const { data } = await admin().from("businesses").select("id").eq("owner_id", user.id).maybeSingle();
  if (data) redirect("/panell");

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Comencem 👋</h1>
      <p className="mt-1 text-stone-600">Com es diu el teu negoci? La resta ho pots canviar després.</p>
      <div className="card mt-6">
        <StateForm action={createBusiness} submit="Crear la meva pàgina">
          <div>
            <label className="label" htmlFor="name">Nom del negoci</label>
            <input className="input" id="name" name="name" required placeholder="Fisioteràpia Marta Puig" />
          </div>
          <div>
            <label className="label" htmlFor="slug">Enllaç de reserves (opcional)</label>
            <div className="flex items-center gap-1 text-sm text-stone-500">
              <span className="whitespace-nowrap">{appUrl().replace(/^https?:\/\//, "")}/r/</span>
              <input className="input" id="slug" name="slug" placeholder="marta-fisio" pattern="[a-z0-9\-]*" />
            </div>
          </div>
        </StateForm>
      </div>
    </div>
  );
}
