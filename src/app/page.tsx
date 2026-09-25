import SkillMapExplorer from "@/components/skill-map/SkillMapExplorer";
import { SKILL_MAP } from "@/data/skill-map";

export default function Home() {
  return <SkillMapExplorer map={SKILL_MAP} />;
}
