type Link = { label: string; href: string };

export type GlossaryConfig = {
  /** URL path and folder under src/content. */
  slug: string;
  /** Shown while the graph loads, and as the page heading. */
  name: string;
  /** Home page card. */
  card: { title: string; description: string };
  /** Text in the info panel. */
  about: string;
  /** Where the content was adapted from, linked in the info panel. */
  source?: Link;
  /** Bottom-left link on the graph. */
  credit: Link;
};

export const GLOSSARIES: GlossaryConfig[] = [
  {
    slug: "ai-glossary",
    name: "The AI Coding Dictionary",
    card: {
      title: "AI coding",
      description:
        "The vocabulary of AI coding in plain English: tokens, context windows, agents, handoffs. Explore it as a 3D graph.",
    },
    about:
      "The vocabulary of AI coding, in plain English. Drag to orbit, scroll to zoom, click a term to read it.",
    source: { label: "Original by aihero.dev", href: "https://www.aihero.dev/ai-coding-dictionary" },
    credit: { label: "AIHero.dev", href: "https://www.aihero.dev/ai-coding-dictionary" },
  },
  {
    slug: "business-glossary",
    name: "The Business Glossary",
    card: {
      title: "Business",
      description:
        "The vocabulary of business in plain English: revenue, margins, equity, funnels. Explore it as a 3D graph.",
    },
    about:
      "The vocabulary of business, in plain English. Drag to orbit, scroll to zoom, click a term to read it.",
    credit: { label: "allglossary.xyz", href: "/" },
  },
];

export function glossaryConfig(slug: string): GlossaryConfig {
  const config = GLOSSARIES.find((g) => g.slug === slug);
  if (!config) throw new Error(`Unknown glossary "${slug}"`);
  return config;
}
