import GlossaryPage, { glossaryMetadata } from "@/components/glossary/GlossaryPage";

export const metadata = glossaryMetadata("nutrition-glossary");

export default function NutritionGlossaryPage() {
  return <GlossaryPage slug="nutrition-glossary" />;
}
