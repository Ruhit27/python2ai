import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { GLOSSARIES } from "@/lib/glossaries";
import { getGlossary } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Stats — allglossary.xyz",
  description: "How many glossaries, terms, and connections allglossary.xyz has, and which terms link the most.",
};

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/55";

function getStats() {
  return GLOSSARIES.map((g) => {
    const { sections, terms } = getGlossary(g.slug);
    // The term other terms link to most often.
    const inbound = new Map<string, number>();
    for (const t of terms) for (const slug of t.links) inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
    const [topSlug, topCount] = [...inbound].sort((a, b) => b[1] - a[1])[0];
    return {
      href: `/${g.slug}`,
      title: g.card.title,
      terms: terms.length,
      sections: sections.length,
      links: terms.reduce((n, t) => n + t.links.length, 0),
      top: { title: terms.find((t) => t.slug === topSlug)!.title, count: topCount },
    };
  });
}

export default function StatsPage() {
  const rows = getStats();
  const totals = [
    { label: "Glossaries", value: rows.length },
    { label: "Terms", value: rows.reduce((n, r) => n + r.terms, 0) },
    { label: "Sections", value: rows.reduce((n, r) => n + r.sections, 0) },
    { label: "Links between terms", value: rows.reduce((n, r) => n + r.links, 0) },
  ];

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <SiteHeader />
        <h1 className="mt-10 font-mono text-3xl font-semibold uppercase tracking-tight sm:text-5xl">Stats</h1>
        <p className="mt-4 max-w-xl text-base text-black/70 sm:text-lg">
          Everything on the site, counted. Updated every time a glossary changes.
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {totals.map((t) => (
            <div key={t.label} className="rounded-2xl border border-black/20 bg-white/40 p-5">
              <dt className={label}>{t.label}</dt>
              <dd className="mt-2 font-mono text-3xl font-semibold tabular-nums">{t.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className={label}>
                <th className="border-b border-black/25 py-3 pr-4 font-medium">Glossary</th>
                <th className="border-b border-black/25 py-3 pr-4 text-right font-medium">Terms</th>
                <th className="border-b border-black/25 py-3 pr-4 text-right font-medium">Sections</th>
                <th className="border-b border-black/25 py-3 pr-4 text-right font-medium">Links</th>
                <th className="border-b border-black/25 py-3 font-medium">Most linked term</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.href} className="border-b border-black/10">
                  <td className="py-3 pr-4">
                    <Link href={r.href} className="font-mono font-semibold uppercase underline-offset-4 hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums">{r.terms}</td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums">{r.sections}</td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums">{r.links}</td>
                  <td className="py-3 text-black/70">
                    {r.top.title} <span className="font-mono text-sm text-black/45">({r.top.count})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
