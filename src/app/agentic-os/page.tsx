import type { Metadata } from "next";
import AgenticOs from "@/components/agentic-os/AgenticOs";

export const metadata: Metadata = {
  title: "Agentic OS — beTshaped.dev",
  description:
    "A public demo of an Agentic OS for developers: a daily digest of AI and dev tooling, a Learn this Agent, and a Dependency check that reads real release notes.",
};

export default function AgenticOsPage() {
  return (
    <main id="main-content" className="flex-1">
      <AgenticOs />
    </main>
  );
}
