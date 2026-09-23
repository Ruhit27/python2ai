import type { Metadata } from "next";
import Link from "next/link";
import { CHEATSHEETS, type Cheatsheet } from "@/data/cheatsheets";

export const metadata: Metadata = {
  title: "Cheatsheets — python2ai",
  description: "Quick-reference cheatsheets for the Python to AI engineer path.",
};

function CheatsheetCard({ sheet }: { sheet: Cheatsheet }) {
  return (
    <Link
      href={`/cheatsheets/${sheet.slug}`}
      className={`group flex flex-col rounded-[28px] p-3 transition-transform hover:-translate-y-1 sm:p-4 ${sheet.bg}`}
    >
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-[#141414]">
        <sheet.icon className={`h-20 w-20 sm:h-24 sm:w-24 ${sheet.iconColor}`} />
      </div>
      <h3 className="mt-5 font-heading text-lg uppercase tracking-tight text-black/90">
        {sheet.title}
      </h3>
      <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-black/70">
        {sheet.description}
      </p>
    </Link>
  );
}

export default function CheatsheetsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-sm text-muted">$ ls cheatsheets/</p>
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Quick-reference <span className="gradient-text">cheatsheets</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-sans text-base font-medium text-muted">
          The essentials, condensed — no fluff, just what you need on hand.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CHEATSHEETS.map((sheet) => (
          <CheatsheetCard key={sheet.slug} sheet={sheet} />
        ))}
      </div>
    </main>
  );
}
