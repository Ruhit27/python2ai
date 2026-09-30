import GlossaryPage, { glossaryMetadata } from "@/components/glossary/GlossaryPage";

export const metadata = glossaryMetadata("gym-glossary");

export default function GymGlossaryPage() {
  return <GlossaryPage slug="gym-glossary" />;
}
