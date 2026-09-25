"use client";

import { Check } from "lucide-react";
import { CORE_COLOR } from "@/lib/skill-map/colors";
import type { Branch, Skill } from "@/lib/skill-map/types";

type Props = {
  core: Skill[];
  branches: { branch: Branch; skills: Skill[] }[];
  chosenBranch: string | null;
  learned: ReadonlySet<string>;
  ready: ReadonlySet<string>;
  selected: string | null;
  onSelect: (id: string) => void;
  onToggleLearned: (id: string) => void;
};

/** The Skill map as plain lists: for phones, reduced motion, and browsers without WebGL. */
export default function SkillList({
  core,
  branches,
  chosenBranch,
  learned,
  ready,
  selected,
  onSelect,
  onToggleLearned,
}: Props) {
  // The chosen Branch comes straight after the Core, since it's the one being learned.
  const ordered = [...branches].sort(
    (a, b) => Number(b.branch.id === chosenBranch) - Number(a.branch.id === chosenBranch),
  );
  const rowProps = { learned, ready, selected, onSelect, onToggleLearned };

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 pt-6 pb-24 sm:px-6">
      <Group title="Core" subtitle="What every developer needs, whatever they specialize in." color={CORE_COLOR}>
        {core.map((s) => (
          <Row key={s.id} skill={s} color={CORE_COLOR} {...rowProps} />
        ))}
      </Group>
      {ordered.map(({ branch, skills }) => (
        <Group
          key={branch.id}
          title={`${branch.title} Branch`}
          subtitle={branch.summary}
          color={branch.color}
          chosen={branch.id === chosenBranch}
          dimmed={chosenBranch !== null && branch.id !== chosenBranch}
        >
          {skills.map((s) => (
            <Row key={s.id} skill={s} color={branch.color} {...rowProps} />
          ))}
        </Group>
      ))}
    </div>
  );
}

function Group({
  title,
  subtitle,
  color,
  chosen,
  dimmed,
  children,
}: {
  title: string;
  subtitle: string;
  color: string;
  chosen?: boolean;
  dimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={dimmed ? "opacity-60" : undefined}>
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
        {title}
        {chosen && <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">· your Branch</span>}
      </h2>
      <p className="mt-1 mb-3 text-sm text-muted">{subtitle}</p>
      <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">{children}</ol>
    </section>
  );
}

function Row({
  skill,
  color,
  learned,
  ready,
  selected,
  onSelect,
  onToggleLearned,
}: {
  skill: Skill;
  color: string;
  learned: ReadonlySet<string>;
  ready: ReadonlySet<string>;
  selected: string | null;
  onSelect: (id: string) => void;
  onToggleLearned: (id: string) => void;
}) {
  const isLearned = learned.has(skill.id);
  return (
    <li className={`flex items-center gap-3 px-3 py-2.5 ${selected === skill.id ? "bg-accent" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={isLearned}
        aria-label={`Mark ${skill.title} as learned`}
        onClick={() => onToggleLearned(skill.id)}
        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border"
        style={isLearned ? { background: color, borderColor: color } : undefined}
      >
        {isLearned && <Check size={15} className="text-black" />}
      </button>
      <button
        type="button"
        onClick={() => onSelect(skill.id)}
        className="flex flex-1 cursor-pointer items-center gap-2 text-left"
      >
        <span className={isLearned ? "text-muted line-through decoration-muted/50" : "font-medium"}>{skill.title}</span>
        {ready.has(skill.id) && (
          <span
            className="whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-black"
            style={{ background: color }}
          >
            Ready next
          </span>
        )}
      </button>
    </li>
  );
}
