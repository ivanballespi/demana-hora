"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";

export function AuthForm({
  action,
  submit,
  withPassword = true,
}: {
  action: (state: AuthState, form: FormData) => Promise<AuthState>;
  submit: string;
  withPassword?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  if (state?.message) return <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{state.message}</p>;
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Correu electrònic</label>
        <input className="input" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {withPassword && (
        <div>
          <label className="label" htmlFor="password">Contrasenya</label>
          <input className="input" id="password" name="password" type="password" required minLength={8} autoComplete="current-password" />
        </div>
      )}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "Un moment..." : submit}</button>
    </form>
  );
}
