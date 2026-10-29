import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold">Aquí no hi ha res 🤷</h1>
      <Link href="/" className="btn-primary">Anar a l&apos;inici</Link>
    </main>
  );
}
