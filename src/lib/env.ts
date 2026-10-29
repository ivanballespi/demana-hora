export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable d'entorn ${name}`);
  return value;
}

export const appUrl = () =>
  (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
