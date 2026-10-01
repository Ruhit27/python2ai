import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SponsorFrame from "@/components/SponsorFrame";

export const metadata: Metadata = {
  title: "Sponsor — allglossary.xyz",
  description: "Help keep allglossary.xyz free and growing. Sponsorship pays for new glossaries and keeps the site ad-free.",
};

// Where sponsors get in touch. Swap for a GitHub Sponsors or payment page once one is set up.
const SPONSOR_LINK = { label: "Get in touch on GitHub", href: "https://github.com/Ruhit27" };

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/55";

const REASONS = [
  {
    title: "New glossaries",
    body: "Each glossary is 50 or more terms, written from scratch and checked for accuracy. Sponsorship pays for the time that takes.",
  },
  {
    title: "Free for everyone",
    body: "No sign-up, no paywall, no ads. Anyone can learn the words of a new field in an afternoon.",
  },
  {
    title: "Kept accurate",
    body: "Fields change. Sponsorship keeps existing terms reviewed and up to date.",
  },
];

export default function SponsorPage() {
  return (
    <main id="main-content" className="flex-1">
      <SponsorFrame>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <SiteHeader />
          <h1 className="mt-10 font-mono text-3xl font-semibold uppercase tracking-tight sm:text-5xl">Sponsor</h1>
          <p className="mt-4 max-w-xl text-base text-black/70 sm:text-lg">
            allglossary.xyz explains the words people keep hearing, in plain English, for free. If it helped you
            or your team, you can help it grow.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {REASONS.map((r) => (
              <li key={r.title} className="rounded-2xl border border-black/20 bg-white/40 p-6">
                <p className={label}>{r.title}</p>
                <p className="mt-3 text-black/70">{r.body}</p>
              </li>
            ))}
          </ul>

          <section className="mt-12 rounded-2xl border border-black/20 bg-white/40 p-6 sm:p-8">
            <h2 className="font-mono text-xl font-semibold uppercase tracking-tight sm:text-2xl">Become a sponsor</h2>
            <p className="mt-3 max-w-2xl text-black/70">
              Individuals and companies are both welcome. Sponsors are thanked with a card on the home and sponsor
              pages. To talk about sponsoring, reach out and say which glossary you&apos;d like to see next.
            </p>
            <a
              href={SPONSOR_LINK.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-[#ecebe8] transition-opacity hover:opacity-85"
            >
              {SPONSOR_LINK.label}
              <ArrowRight size={16} />
            </a>
          </section>
        </div>
      </SponsorFrame>
    </main>
  );
}
