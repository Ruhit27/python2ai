import type { Metadata } from "next";
import DictionaryExplorer from "@/components/dictionary/DictionaryExplorer";
import { getDictionary } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "The AI Coding Dictionary — python2ai",
  description:
    "The vocabulary of AI coding in plain English: tokens, context windows, agents, handoffs. Explore it as a 3D graph. Source: aihero.dev.",
};

export default function AiCodingDictionaryPage() {
  return (
    <main id="main-content" className="flex-1">
      <DictionaryExplorer data={getDictionary()} />
    </main>
  );
}
