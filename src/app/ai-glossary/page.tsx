import GlossaryPage, { glossaryMetadata } from "@/components/glossary/GlossaryPage";

export const metadata = glossaryMetadata("ai-glossary");

export default function AiGlossaryPage() {
  return <GlossaryPage slug="ai-glossary" />;
}
