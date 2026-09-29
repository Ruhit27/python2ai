import type { Metadata } from "next";
import { glossaryConfig } from "@/lib/glossaries";
import { getGlossary } from "@/lib/glossary";
import GlossaryExplorer from "./GlossaryExplorer";

export function glossaryMetadata(slug: string): Metadata {
  const config = glossaryConfig(slug);
  return { title: `${config.name} — allglossary.xyz`, description: config.card.description };
}

export default function GlossaryPage({ slug }: { slug: string }) {
  return (
    <main id="main-content" className="flex-1">
      <GlossaryExplorer data={getGlossary(slug)} config={glossaryConfig(slug)} />
    </main>
  );
}
