import GlossaryPage, { glossaryMetadata } from "@/components/glossary/GlossaryPage";

export const metadata = glossaryMetadata("business-glossary");

export default function BusinessGlossaryPage() {
  return <GlossaryPage slug="business-glossary" />;
}
