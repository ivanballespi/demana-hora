import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, JsonLd, ToolCard } from "@/components/Chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { CATEGORY_INFO, TOOLS, type Category } from "@/tools/registry";

export const dynamicParams = false;
export const generateStaticParams = () => Object.values(CATEGORY_INFO).map((c) => ({ cat: c.slug }));

const bySlug = (slug: string) => (Object.entries(CATEGORY_INFO) as [Category, (typeof CATEGORY_INFO)[Category]][]).find(([, v]) => v.slug === slug);

export async function generateMetadata({ params }: PageProps<"/categoria/[cat]">): Promise<Metadata> {
  const found = bySlug((await params).cat);
  if (!found) return {};
  const [, info] = found;
  const url = `${SITE_URL}/categoria/${info.slug}/`;
  return { title: info.title, description: info.intro, alternates: { canonical: url }, openGraph: { title: info.title, description: info.intro, url } };
}

export default async function Page({ params }: PageProps<"/categoria/[cat]">) {
  const found = bySlug((await params).cat);
  if (!found) notFound();
  const [cat, info] = found;
  const tools = TOOLS.filter((t) => t.category === cat);
  const url = `${SITE_URL}/categoria/${info.slug}/`;
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <nav className="text-xs text-stone-500"><Link href="/" className="hover:underline">Inicio</Link> › {info.title}</nav>
        <div className="mt-3 text-5xl">{info.icon}</div>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">{info.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">{info.intro}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => <ToolCard key={t.slug} slug={t.slug} name={t.name} description={t.description} big />)}
        </div>
        <section className="mt-14">
          <h2 className="text-lg font-bold">Otras categorías</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.values(CATEGORY_INFO).filter((c) => c.slug !== info.slug).map((c) => (
              <Link key={c.slug} href={`/categoria/${c.slug}/`} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">{c.icon} {c.title}</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "CollectionPage", name: info.title, url, description: info.intro, inLanguage: "es" },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: info.title, item: url },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
