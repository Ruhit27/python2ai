import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { GLOSSARIES } from "@/lib/glossaries";
import { getGlossary } from "@/lib/glossary";

function getGlossaries() {
  return GLOSSARIES.map((g) => {
    const data = getGlossary(g.slug);
    return {
      href: `/${g.slug}`,
      ...g.card,
      sections: data.sections.map((s) => s.title),
      termCount: data.terms.length,
    };
  });
}

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/55";

export default function Home() {
  const glossaries = getGlossaries();

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto flex min-h-full max-w-4xl flex-col px-4 py-12 sm:px-6 sm:py-20">
        <SiteHeader />
        <header>
          <h1 className="mt-10 font-mono text-3xl font-semibold uppercase tracking-tight sm:text-5xl">
            Glossaries
          </h1>
          <p className="mt-4 max-w-xl text-base text-black/70 sm:text-lg">
            The words you keep hearing, explained in plain English. Pick a glossary and explore how its
            terms connect.
          </p>
        </header>

        <ul className="mt-12 grid gap-4 sm:mt-16">
          {glossaries.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group block rounded-2xl border border-black/20 bg-white/40 p-6 transition-colors hover:border-black/40 hover:bg-white/70 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={label}>{g.termCount} terms</p>
                    <h2 className="mt-2 font-mono text-xl font-semibold uppercase tracking-tight sm:text-2xl">
                      {g.title}
                    </h2>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/25 transition-transform group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-black/70">{g.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.sections.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-black/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-black/60"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>

        <p className={`${label} mt-10`}>More glossaries coming soon</p>
      </div>
    </main>
  );
}
