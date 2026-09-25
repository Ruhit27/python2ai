import SystemHome from "@/components/skill-map/SystemHome";
import { SKILL_MAP } from "@/data/skill-map";

export default function Home() {
  return <SystemHome map={SKILL_MAP} />;
}
