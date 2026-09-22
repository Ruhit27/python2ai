import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHEATSHEETS, getCheatsheet } from "@/data/cheatsheets";

export function generateStaticParams() {
  return CHEATSHEETS.map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) return {};
  return {
    title: `${sheet.title} — python2ai`,
    description: sheet.subtitle,
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
      <Link
        href="/cheatsheets"
        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        ← All cheatsheets
      </Link>

      <article className="mt-6 rounded-[28px] border border-border bg-surface p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#141414]">
            <sheet.icon className={`h-6 w-6 ${sheet.iconColor}`} />
          </span>
          <h1 className="font-heading text-xl tracking-tight sm:text-2xl">
            <span className="gradient-text">{sheet.title}</span>
          </h1>
        </div>
        <p className="mt-3 font-quicksand text-sm font-medium text-muted">{sheet.subtitle}</p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="w-12 px-4 py-3 font-mono text-xs font-medium text-muted">#</th>
                <th className="px-4 py-3 font-mono text-xs font-medium text-muted">Function</th>
                <th className="px-4 py-3 font-mono text-xs font-medium text-muted">Purpose</th>
                <th className="px-4 py-3 font-mono text-xs font-medium text-muted">Example</th>
              </tr>
            </thead>
            <tbody>
              {sheet.items.map((item) => (
                <tr key={item.n} className="border-b border-border last:border-0 even:bg-background/30">
                  <td className="px-4 py-3 align-top font-mono text-xs text-muted">{item.n}</td>
                  <td className="px-4 py-3 align-top font-mono text-sm font-semibold text-accent-via">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/80">{item.purpose}</td>
                  <td className="px-4 py-3 align-top">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-foreground/70">
                      {item.example}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </main>
  );
}
