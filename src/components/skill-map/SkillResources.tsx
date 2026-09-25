import Link from "next/link";
import { BookOpen, ExternalLink, GraduationCap, PlayCircle } from "lucide-react";
import { termSlug } from "@/lib/term-slug";
import type { ResourceKind, Skill } from "@/lib/skill-map/types";

const KIND: Record<ResourceKind, { label: string; Icon: typeof BookOpen }> = {
  docs: { label: "Docs", Icon: BookOpen },
  course: { label: "Course", Icon: GraduationCap },
  video: { label: "Video", Icon: PlayCircle },
};

/** The free places to learn a Skill, then any related AI glossary entries. */
export default function SkillResources({ skill }: { skill: Skill }) {
  return (
    <>
      <h4 className="mt-5 mb-2 font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">
        Where to learn it (free)
      </h4>
      <ul className="grid gap-2">
        {skill.resources.map((r) => {
          const { label, Icon } = KIND[r.kind];
          return (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 border border-cyan-400/20 bg-[#020617]/60 p-3 transition-colors hover:border-cyan-300/60"
              >
                <Icon size={17} className="mt-0.5 shrink-0 text-cyan-300" />
                <span className="flex-1">
                  <span className="block font-semibold text-slate-100 group-hover:underline">{r.title}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-slate-500">
                    {label} · {new URL(r.url).hostname.replace(/^www\./, "")} · checked {r.checked}
                  </span>
                </span>
                <ExternalLink size={14} className="mt-1 shrink-0 text-slate-500" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
      {skill.glossary.length > 0 && (
        <>
          <h4 className="mt-4 mb-2 font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">
            In the AI glossary
          </h4>
          <ul className="flex flex-wrap gap-2">
            {skill.glossary.map((title) => (
              <li key={title}>
                <Link
                  href={`/ai-glossary?term=${termSlug(title)}`}
                  className="block border border-cyan-400/25 px-2.5 py-1 text-[13px] text-cyan-100 hover:border-cyan-300"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
