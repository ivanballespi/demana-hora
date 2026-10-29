"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/panell/actions";

export function StateForm({
  action,
  submit,
  children,
  className = "space-y-4",
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  submit: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={pending}>{pending ? "Desant..." : submit}</button>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p className="text-sm text-emerald-700">{state.ok}</p>}
      </div>
    </form>
  );
}
