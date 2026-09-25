"use client";

import dynamic from "next/dynamic";
import { Box, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { areaColor } from "@/lib/skill-map/colors";
import { loadProgress, saveProgress, type Progress } from "@/lib/skill-map/progress";
import { readyNext } from "@/lib/skill-map/ready-next";
import type { SkillMap } from "@/lib/skill-map/types";
import SkillList from "./SkillList";
import SkillPanel from "./SkillPanel";

const SkillMapScene = dynamic(() => import("./SkillMapScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-surface/40" />,
});

type View = "3d" | "list";

const VIEW_KEY = "betshaped:view";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** 3D unless the device is small, asks for less motion, or can't draw it — or the Learner chose otherwise. */
function defaultView(webgl: boolean): View {
  if (!webgl) return "list";
  try {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "3d" || saved === "list") return saved;
  } catch {}
  const small = window.matchMedia("(max-width: 767px)").matches;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return small || calm ? "list" : "3d";
}

export default function SkillMapExplorer({ map }: { map: SkillMap }) {
  const [progress, setProgress] = useState<Progress>({ learned: new Set(), branch: null });
  const [view, setView] = useState<View | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [insetRight, setInsetRight] = useState(0);
  const panel = useRef<HTMLElement>(null);

  const ids = useMemo(
    () => ({ skills: new Set(map.skills.map((s) => s.id)), branches: new Set(map.branches.map((b) => b.id)) }),
    [map],
  );
  const bySkill = useMemo(() => new Map(map.skills.map((s) => [s.id, s])), [map]);
  const byBranch = useMemo(() => new Map(map.branches.map((b) => [b.id, b])), [map]);
  const ready = useMemo(() => readyNext(map.skills, progress.learned), [map, progress.learned]);

  // Saved progress, the view and a ?skill= link are only readable after hydration.
  useEffect(() => {
    const gl = hasWebGL();
    const fromUrl = new URLSearchParams(window.location.search).get("skill");
    /* eslint-disable react-hooks/set-state-in-effect */
    setProgress(loadProgress(window.localStorage, ids));
    setWebgl(gl);
    setView(defaultView(gl));
    if (fromUrl && ids.skills.has(fromUrl)) setSelected(fromUrl);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ids]);

  const update = useCallback((change: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = change(p);
      saveProgress(window.localStorage, next);
      return next;
    });
  }, []);

  const toggleLearned = useCallback(
    (id: string) =>
      update((p) => {
        const learned = new Set(p.learned);
        if (!learned.delete(id)) learned.add(id);
        return { ...p, learned };
      }),
    [update],
  );

  const chooseBranch = (id: string) => update((p) => ({ ...p, branch: p.branch === id ? null : id }));

  const select = useCallback((id: string | null) => {
    setSelected(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("skill", id);
    else url.searchParams.delete("skill");
    window.history.replaceState(null, "", url);
  }, []);

  const switchView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {}
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  // On wide screens the panel sits beside the scene; on narrow ones it's a bottom sheet.
  const hasPanel = selected !== null;
  useEffect(() => {
    const el = panel.current;
    const wide = window.matchMedia("(min-width: 1024px)");
    if (!hasPanel || !el) {
      setInsetRight(0);
      return;
    }
    const measure = () => setInsetRight(wide.matches ? el.offsetWidth : 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPanel]);

  const skill = selected ? bySkill.get(selected) : undefined;
  const skillBranch = skill && skill.area !== "core" ? byBranch.get(skill.area)! : null;
  const learnedCount = progress.learned.size;

  const header = (
    <div className="pointer-events-auto max-w-md">
      <h1 className="font-heading text-[26px] leading-none tracking-tight sm:text-4xl">
        Become a <span className="gradient-text">T-shaped</span> developer
      </h1>
      <p className="mt-2 text-sm font-medium text-muted sm:text-base">Learn broad, go deep. Every resource free.</p>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/70">
        The <strong className="text-foreground">Core</strong> across the top is what every developer needs. Pick one{" "}
        <strong className="text-foreground">Branch</strong> below it to go deep in. Click any Skill to see free ways to
        learn it.
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {learnedCount} of {map.skills.length} Skills learned
        {ready.size > 0 && <span className="text-foreground/70"> · {ready.size} ready next</span>}
      </p>
    </div>
  );

  const branchPicker = (
    <div className="pointer-events-auto">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Choose your Branch</p>
      <div className="flex flex-wrap gap-2">
        {map.branches.map((b) => {
          const chosen = progress.branch === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={chosen}
              title={b.summary}
              onClick={() => chooseBranch(b.id)}
              className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold backdrop-blur transition-colors"
              style={
                chosen
                  ? { background: b.color, borderColor: b.color, color: "#000" }
                  : { borderColor: `${b.color}66`, background: "rgba(8,9,12,0.6)" }
              }
            >
              {!chosen && <span className="h-2 w-2 rounded-full" style={{ background: b.color }} aria-hidden />}
              {b.title}
            </button>
          );
        })}
      </div>
    </div>
  );

  const viewToggle = (
    <div
      className="pointer-events-auto flex rounded-full border border-border bg-background/70 p-1 backdrop-blur"
      role="group"
      aria-label="View"
    >
      {(
        [
          ["3d", "3D map", Box],
          ["list", "List", List],
        ] as const
      ).map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          aria-pressed={view === id}
          disabled={id === "3d" && !webgl}
          title={id === "3d" && !webgl ? "Your browser can't show the 3D map" : undefined}
          onClick={() => switchView(id)}
          className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            view === id ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
        >
          <Icon size={14} aria-hidden />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      ))}
    </div>
  );

  const skillPanel = skill && (
    <SkillPanel
      ref={panel}
      skill={skill}
      branch={skillBranch}
      color={areaColor(map, skill.area)}
      bySkill={bySkill}
      learned={progress.learned}
      ready={ready.has(skill.id)}
      onToggleLearned={toggleLearned}
      onSelect={select}
      onClose={() => select(null)}
    />
  );

  // Until the view is known, the list layout shows just the header, so phones never flash the 3D shell.
  if (view !== "3d") {
    return (
      <main className="flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-10 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            {header}
            {view && webgl && viewToggle}
          </div>
          {branchPicker}
        </div>
        {view === "list" && (
          <SkillList
            core={map.skills.filter((s) => s.area === "core")}
            branches={map.branches.map((b) => ({ branch: b, skills: map.skills.filter((s) => s.area === b.id) }))}
            chosenBranch={progress.branch}
            learned={progress.learned}
            ready={ready}
            selected={selected}
            onSelect={select}
            onToggleLearned={toggleLearned}
          />
        )}
        {skillPanel}
      </main>
    );
  }

  return (
    <main className="relative h-[calc(100dvh-4rem)] overflow-hidden">
      <SkillMapScene
        map={map}
        learned={progress.learned}
        ready={ready}
        branch={progress.branch}
        selected={selected}
        onSelect={select}
        insetRight={insetRight}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6"
        style={{ right: insetRight }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="-mt-3 -ml-3 rounded-2xl bg-background/60 p-3 backdrop-blur-md">{header}</div>
          {viewToggle}
        </div>
        <div className="flex items-end justify-between gap-4">
          {branchPicker}
          <p className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:block">
            Drag to orbit · Scroll to zoom · Click a Skill
          </p>
        </div>
      </div>
      {skillPanel}
    </main>
  );
}
