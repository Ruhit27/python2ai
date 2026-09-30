import GlossaryPage, { glossaryMetadata } from "@/components/glossary/GlossaryPage";

export const metadata = glossaryMetadata("cybersecurity-glossary");

export default function CybersecurityGlossaryPage() {
  return <GlossaryPage slug="cybersecurity-glossary" />;
}
