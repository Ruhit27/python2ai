"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import type { Rank } from "@/lib/skill-map/rank";
import type { SkillMap } from "@/lib/skill-map/types";
import { SkillRow, type Standing } from "./Dashboard";
import SkillResources from "./SkillResources";
import SystemWindow, { SystemButton } from "./SystemWindow";

/** A System window over a dimmed page; Escape or the backdrop closes it. */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#020617]/75 p-4 pt-[8vh] motion-safe:animate-in motion-safe:fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-2xl motion-safe:animate-in motion-safe:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-1.5 right-2 z-10 cursor-pointer p-1 text-cyan-300 hover:text-white"
        >
          <X size={18} />
        </button>
        <SystemWindow title={title}>{children}</SystemWindow>
      </div>
    </div>
  );
}

export function SkillDetail({
  map,
  id,
  standing,
  onClose,
  onPick,
  onClear,
  onUndo,
  onOpen,
}: {
  map: SkillMap;
  id: string;
  standing: Standing;
  onClose: () => void;
  onPick: (id: string) => void;
  onClear: (id: string) => void;
  onUndo: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const skill = map.skills.find((s) => s.id === id)!;
  const cleared = standing.learned.has(id);
  const area = skill.area === "core" ? "Core" : `Job: ${map.branches.find((b) => b.id === skill.area)?.title}`;
  return (
    <Modal title="Quest info" onClose={onClose}>
      <p className="font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">
        {area}
        {cleared ? " · Cleared" : standing.ready.has(id) ? " · Ready" : ""}
      </p>
      <h3 className="mt-1 text-2xl font-bold text-white">{skill.title}</h3>
      <p className="mt-2 text-[15px] text-slate-300">{skill.summary}</p>
      <p className="mt-3 text-[14px] text-slate-400">
        <span className="font-mono text-[11px] tracking-[0.2em] text-cyan-300/80 uppercase">Why · </span>
        {skill.why}
      </p>
      {skill.prerequisites.length > 0 && (
        <>
          <h4 className="mt-5 mb-2 font-mono text-[11px] tracking-[0.25em] text-cyan-300/80 uppercase">Builds on</h4>
          <ul className="grid gap-1">
            {skill.prerequisites.map((p) => (
              <li key={p}>
                <SkillRow skill={map.skills.find((s) => s.id === p)!} standing={standing} onOpen={onOpen} />
              </li>
            ))}
          </ul>
        </>
      )}
      <SkillResources skill={skill} />
      <div className="mt-5 flex flex-wrap gap-2">
        {cleared ? (
          <SystemButton onClick={() => onUndo(id)}>Undo clear</SystemButton>
        ) : (
          <>
            {standing.current !== id && (
              <SystemButton primary onClick={() => onPick(id)}>
                Make Active quest
              </SystemButton>
            )}
            <SystemButton primary={standing.current === id} onClick={() => onClear(id)}>
              Clear quest
            </SystemButton>
          </>
        )}
      </div>
    </Modal>
  );
}

/** The whole Skill map: the Core and every Branch, not only the Learner's Job. */
export function SkillMapWindow({
  map,
  standing,
  onClose,
  onOpen,
}: {
  map: SkillMap;
  standing: Standing;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const groups = [
    { id: "core", title: "Core", summary: "What every developer needs, whatever their Job." },
    ...map.branches.map((b) => ({ id: b.id, title: `Job: ${b.title}`, summary: b.summary })),
  ];
  return (
    <Modal title="Skill map" onClose={onClose}>
      <div className="grid gap-6">
        {groups.map((g) => (
          <section key={g.id}>
            <h3 className="font-mono text-[12px] tracking-[0.25em] text-cyan-200 uppercase">
              {g.title}
              {g.id === standing.branch?.id && <span className="text-cyan-400"> · your Job</span>}
            </h3>
            <p className="mt-1 mb-2 text-[13px] text-slate-400">{g.summary}</p>
            <ol className="grid gap-1 sm:grid-cols-2">
              {map.skills
                .filter((s) => s.area === g.id)
                .map((s) => (
                  <li key={s.id}>
                    <SkillRow skill={s} standing={standing} onOpen={onOpen} />
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </div>
    </Modal>
  );
}

/** The level-up moment after clearing a quest. */
export function LevelUp({ level, rank, rankedUp }: { level: number; rank: Rank; rankedUp: boolean }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.7)_45%,transparent_80%)] motion-safe:animate-in motion-safe:fade-in"
    >
      <div className="text-center motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:duration-500">
        <p className="font-heading text-6xl tracking-wide text-cyan-100 [text-shadow:0_0_30px_rgba(34,211,238,1),0_0_60px_rgba(14,165,233,0.8)] sm:text-8xl">
          Level up!
        </p>
        <p className="mt-3 font-mono text-lg tracking-[0.3em] text-cyan-200">LV. {level}</p>
        {rankedUp && (
          <p className="mt-4 font-mono text-xl tracking-[0.3em] text-amber-200 [text-shadow:0_0_20px_rgba(251,191,36,0.9)]">
            RANK {rank} ACHIEVED
          </p>
        )}
      </div>
    </div>
  );
}

/** System notifications stacked in the corner, each fading after a few seconds. */
export function Notifications({ items }: { items: { id: number; text: string }[] }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 grid w-72 gap-2">
      {items.map((n) => (
        <div
          key={n.id}
          className="border border-cyan-300/60 bg-[#051024]/90 px-3 py-2 font-mono text-[12px] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4"
        >
          <span className="text-cyan-300">[NOTIFICATION]</span> {n.text}
        </div>
      ))}
    </div>
  );
}
