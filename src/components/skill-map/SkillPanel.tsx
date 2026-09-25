"use client";

import Link from "next/link";
import { BookOpen, Check, ExternalLink, GraduationCap, PlayCircle, X } from "lucide-react";
import type { Ref } from "react";
import { termSlug } from "@/lib/term-slug";
import type { Branch, ResourceKind, Skill } from "@/lib/skill-map/types";

const KIND: Record<ResourceKind, { label: string; Icon: typeof BookOpen }> = {
  docs: { label: "Docs", Icon: BookOpen },
  course: { label: "Course", Icon: GraduationCap },
  video: { label: "Video", Icon: PlayCircle },
};

type Props = {
  skill: Skill;
  branch: Branch | null;
  color: string;
  bySkill: Map<string, Skill>;
  learned: ReadonlySet<string>;
  ready: boolean;
  onToggleLearned: (id: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
  ref?: Ref<HTMLElement>;
};

/** Everything about one Skill: what it is, why it matters, where to learn it free. */
export default function SkillPanel({
  skill,
  branch,
  color,
  bySkill,
  learned,
  ready,
  onToggleLearned,
  onSelect,
  onClose,
  ref,
}: Props) {
  const isLearned = learned.has(skill.id);
  return (
    <aside
      ref={ref}
      aria-label={skill.title}
      className="fixed inset-x-0 bottom-0 z-40 flex max-h-[70vh] flex-col rounded-t-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur-md lg:inset-x-auto lg:top-16 lg:right-0 lg:max-h-none lg:w-[400px] lg:rounded-none lg:border-y-0 lg:border-r-0"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
            {branch ? `${branch.title} Branch` : "Core"}
            {ready && !isLearned && <span className="ml-2 text-foreground/70">· Ready next</span>}
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight">{skill.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-accent hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 text-[15px] leading-relaxed">
        <p>{skill.summary}</p>

        <section>
          <h3 className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Why it matters</h3>
          <p className="text-foreground/85">{skill.why}</p>
        </section>

        {skill.prerequisites.length > 0 && (
          <section>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Learn first</h3>
            <ul className="flex flex-wrap gap-2">
              {skill.prerequisites.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onSelect(id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[13px] hover:border-foreground/40"
                  >
                    {learned.has(id) && <Check size={13} className="text-emerald-400" aria-label="learned" />}
                    {bySkill.get(id)?.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Learn it free</h3>
          <ul className="space-y-2">
            {skill.resources.map((r) => {
              const { label, Icon } = KIND[r.kind];
              return (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-foreground/30"
                  >
                    <Icon size={18} className="mt-0.5 shrink-0" style={{ color }} />
                    <span className="flex-1">
                      <span className="block font-semibold leading-snug group-hover:underline">{r.title}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-muted">
                        {label} · {new URL(r.url).hostname.replace(/^www\./, "")} · checked {r.checked}
                      </span>
                    </span>
                    <ExternalLink size={14} className="mt-1 shrink-0 text-muted" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {skill.glossary.length > 0 && (
          <section>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">In the AI glossary</h3>
            <ul className="flex flex-wrap gap-2">
              {skill.glossary.map((title) => (
                <li key={title}>
                  <Link
                    href={`/ai-glossary?term=${termSlug(title)}`}
                    className="block rounded-full bg-accent px-3 py-1 text-[13px] hover:bg-border"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="border-t border-border p-4">
        <button
          type="button"
          aria-pressed={isLearned}
          onClick={() => onToggleLearned(skill.id)}
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${
            isLearned ? "border border-border text-foreground hover:bg-accent" : "text-black"
          }`}
          style={isLearned ? undefined : { background: color }}
        >
          {isLearned ? (
            <>
              <Check size={16} /> Learned · undo
            </>
          ) : (
            "Mark as learned"
          )}
        </button>
      </div>
    </aside>
  );
}
