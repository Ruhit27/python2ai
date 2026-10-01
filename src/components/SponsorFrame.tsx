import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SPONSORS, type Sponsor } from "@/lib/sponsors";

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/55";

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      style={{ "--accent": sponsor.accent } as CSSProperties}
      className="group block h-full overflow-hidden rounded-2xl border border-black/20 bg-white/60 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_12px_28px_-12px_var(--accent)]"
    >
      <div className="flex h-24 items-center justify-center bg-[color-mix(in_srgb,var(--accent)_14%,white)] p-4 transition-colors group-hover:bg-[color-mix(in_srgb,var(--accent)_22%,white)]">
        <Image
          src={sponsor.logo.src}
          width={sponsor.logo.width}
          height={sponsor.logo.height}
          alt={`${sponsor.name} logo`}
          className="max-h-16 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="font-mono text-sm font-semibold uppercase tracking-tight">{sponsor.name}</p>
        <p className="mt-1 text-[13px] leading-snug text-black/65">{sponsor.tagline}</p>
        <p className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--accent)]">
          Visit
          <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </p>
      </div>
    </a>
  );
}

function SponsorRail({ side }: { side: Sponsor["side"] }) {
  return (
    <aside
      aria-label="Sponsors"
      className={`hidden xl:row-start-1 xl:block xl:w-44 xl:pt-40 ${
        side === "left" ? "xl:col-start-1 xl:justify-self-end xl:mr-6" : "xl:col-start-3 xl:justify-self-start xl:ml-6"
      }`}
    >
      <div className="sticky top-10">
        <p className={label}>Sponsors</p>
        <ul className="mt-3 grid gap-4">
          {SPONSORS.filter((s) => s.side === side).map((s) => (
            <li key={s.name}>
              <SponsorCard sponsor={s} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/**
 * Wraps a page's centered column with Sponsor cards: in rails on either side on wide screens,
 * and in a row below the content on narrower ones.
 */
export default function SponsorFrame({ children }: { children: ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_56rem_minmax(0,1fr)]">
      <div className="min-w-0 xl:col-start-2 xl:row-start-1">
        {children}
        <section aria-label="Sponsors" className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 sm:pb-20 xl:hidden">
          <p className={label}>Sponsors</p>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SPONSORS.map((s) => (
              <li key={s.name}>
                <SponsorCard sponsor={s} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SponsorRail side="left" />
      <SponsorRail side="right" />
    </div>
  );
}
