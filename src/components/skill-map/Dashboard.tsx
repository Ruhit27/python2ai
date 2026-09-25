"use client";

import { Check, Circle, Play, Sparkles } from "lucide-react";
import { learnedIn, nextRankNeeds, type Rank } from "@/lib/skill-map/rank";
import type { Branch, Skill, SkillMap } from "@/lib/skill-map/types";
import SkillResources from "./SkillResources";
import SystemWindow, { SystemButton } from "./SystemWindow";

export type Standing = {
  learned: ReadonlySet<string>;
  ready: ReadonlySet<string>;
  current: string | null;
  branch: Branch | null;
  level: number;
  rank: Rank;
};

/** One line telling the Learner what the next Rank takes. */
function nextRankHint(map: SkillMap, s: Standing) {
  const next = nextRankNeeds(map, s.learned, s.branch?.id ?? null);
  if (!next) return "The highest Rank. You are a T-shaped developer.";
  if (next.area === null) return "Complete the Job change to rank up.";
  const where = next.area === "core" ? "Core" : s.branch!.title;
  return `Clear ${next.skills} more ${where} quest${next.skills === 1 ? "" : "s"} to reach Rank ${next.rank}.`;
}

export function StatusWindow({
  map,
  standing,
  onOpenMap,
  onJobChange,
}: {
  map: SkillMap;
  standing: Standing;
  onOpenMap: () => void;
  onJobChange: () => void;
}) {
  const core = learnedIn(map, standing.learned, "core");
  const own = standing.branch ? learnedIn(map, standing.learned, standing.branch.id) : { learned: 0, total: 0 };
  const done = core.learned + own.learned;
  const total = core.total + own.total;
  return (
    <SystemWindow title="Status">
      <div className="flex items-center gap-5">
        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-300/70 uppercase">Rank</p>
          <p className="font-heading text-6xl leading-none text-cyan-100 [text-shadow:0_0_24px_rgba(34,211,238,0.9)]">
            {standing.rank}
          </p>
        </div>
        <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[13px]">
          <dt className="text-cyan-300/70">NAME</dt>
          <dd className="text-slate-100">Player</dd>
          <dt className="text-cyan-300/70">LEVEL</dt>
          <dd className="text-slate-100">{standing.level}</dd>
          <dt className="text-cyan-300/70">JOB</dt>
          <dd className="text-slate-100">{standing.branch?.title ?? "None"}</dd>
        </dl>
      </div>
      <div className="mt-4">
        <div className="flex justify-between font-mono text-[11px] text-cyan-300/80">
          <span>{standing.branch ? "Core + Job" : "Core"}</span>
          <span>
            {done} / {total}
          </span>
        </div>
        <div className="mt-1 h-2 border border-cyan-400/40 bg-cyan-950/40">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-[width] duration-700"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[13px] text-slate-400">{nextRankHint(map, standing)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SystemButton onClick={onOpenMap}>Skill map</SystemButton>
        <SystemButton primary={!standing.branch} onClick={onJobChange}>
          Job change
        </SystemButton>
      </div>
    </SystemWindow>
  );
}

export function CurrentSkillWindow({
  map,
  standing,
  onPick,
  onClear,
  onDrop,
}: {
  map: SkillMap;
  standing: Standing;
  onPick: (id: string) => void;
  onClear: (id: string) => void;
  onDrop: () => void;
}) {
  const skill = map.skills.find((s) => s.id === standing.current);

  if (!skill) {
    const suggested = map.skills.filter(
      (s) => standing.ready.has(s.id) && (s.area === "core" || s.area === standing.branch?.id),
    );
    return (
      <SystemWindow title="Choose your next quest" alert>
        {suggested.length ? (
          <>
            <p className="text-[15px] text-slate-300">
              These quests are ready: you have everything they build on. Pick one to make it your Active quest, or pick
              any quest from the log below.
            </p>
            <ul className="mt-4 grid gap-2">
              {suggested.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onPick(s.id)}
                    className="group flex w-full cursor-pointer items-center gap-3 border border-cyan-400/30 bg-cyan-400/5 px-4 py-3 text-left transition-colors hover:border-cyan-300 hover:bg-cyan-400/15"
                  >
                    <Sparkles size={16} className="shrink-0 text-cyan-300" />
                    <span className="flex-1">
                      <span className="block font-semibold text-slate-100">{s.title}</span>
                      <span className="block text-[13px] text-slate-400">{s.summary}</span>
                    </span>
                    <span className="font-mono text-[11px] tracking-widest text-cyan-300 opacity-0 group-hover:opacity-100">
                      ACCEPT
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[15px] text-slate-300">
            {standing.branch
              ? "Every Core and Job quest is cleared. Pick a quest from another Job in the Skill map, or change Job."
              : "The Core is cleared. Complete the Job change to see your next quests."}
          </p>
        )}
      </SystemWindow>
    );
  }

  return (
    <SystemWindow title="Active quest" alert>
      <p className="font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">
        {skill.area === "core" ? "Core" : map.branches.find((b) => b.id === skill.area)?.title}
      </p>
      <h3 className="mt-1 text-2xl font-bold text-white">{skill.title}</h3>
      <p className="mt-2 text-[15px] text-slate-300">{skill.summary}</p>
      <p className="mt-3 text-[14px] text-slate-400">
        <span className="font-mono text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase">Why · </span>
        {skill.why}
      </p>
      <SkillResources skill={skill} />
      <div className="mt-5 flex flex-wrap gap-2">
        <SystemButton primary onClick={() => onClear(skill.id)}>
          Clear quest
        </SystemButton>
        <SystemButton onClick={onDrop}>Choose another</SystemButton>
      </div>
    </SystemWindow>
  );
}

export function SkillLog({
  map,
  standing,
  onOpen,
  onJobChange,
}: {
  map: SkillMap;
  standing: Standing;
  onOpen: (id: string) => void;
  onJobChange: () => void;
}) {
  const groups = [
    { title: "Core", skills: map.skills.filter((s) => s.area === "core") },
    ...(standing.branch
      ? [{ title: `Job: ${standing.branch.title}`, skills: map.skills.filter((s) => s.area === standing.branch!.id) }]
      : []),
  ];
  return (
    <SystemWindow title="Quest log">
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-2 font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">
              {g.title} · {g.skills.filter((s) => standing.learned.has(s.id)).length}/{g.skills.length}
            </h3>
            <ol className="grid gap-1">
              {g.skills.map((s) => (
                <li key={s.id}>
                  <SkillRow skill={s} standing={standing} onOpen={onOpen} />
                </li>
              ))}
            </ol>
          </div>
        ))}
        {!standing.branch && (
          <div className="flex flex-col items-start justify-center gap-3 border border-dashed border-cyan-400/30 p-4">
            <p className="text-[14px] text-slate-400">
              Your Job&apos;s quests appear here once you choose one: the area you&apos;ll go deep in.
            </p>
            <SystemButton primary onClick={onJobChange}>
              Job change
            </SystemButton>
          </div>
        )}
      </div>
    </SystemWindow>
  );
}

/** A Skill in a list, marked cleared, active, ready or not started; opens its details. */
export function SkillRow({
  skill,
  standing,
  onOpen,
}: {
  skill: Skill;
  standing: Standing;
  onOpen: (id: string) => void;
}) {
  const cleared = standing.learned.has(skill.id);
  const active = standing.current === skill.id;
  const ready = standing.ready.has(skill.id);
  return (
    <button
      type="button"
      onClick={() => onOpen(skill.id)}
      className={`flex w-full cursor-pointer items-center gap-3 border px-3 py-2 text-left text-[14px] transition-colors ${
        active
          ? "border-cyan-300 bg-cyan-400/15 text-white shadow-[0_0_14px_rgba(34,211,238,0.35)]"
          : "border-transparent hover:border-cyan-400/40 hover:bg-cyan-400/5"
      } ${cleared ? "text-slate-500" : ready ? "text-slate-100" : "text-slate-400"}`}
    >
      {cleared ? (
        <Check size={15} className="shrink-0 text-cyan-400" aria-label="Cleared" />
      ) : active ? (
        <Play size={15} className="shrink-0 fill-cyan-300 text-cyan-300" aria-label="Active quest" />
      ) : ready ? (
        <Sparkles size={15} className="shrink-0 text-cyan-300" aria-label="Ready next" />
      ) : (
        <Circle size={15} className="shrink-0 text-slate-600" aria-label="Not started" />
      )}
      <span className={`flex-1 ${cleared ? "line-through decoration-slate-600" : ""}`}>{skill.title}</span>
      {ready && !active && <span className="font-mono text-[10px] tracking-widest text-cyan-300">READY</span>}
    </button>
  );
}
