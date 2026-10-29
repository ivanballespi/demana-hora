import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold">Página no encontrada</h1>
      <Link href="/" className="btn-primary">Ver todas las herramientas</Link>
    </main>
  );
}
