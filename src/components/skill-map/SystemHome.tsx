"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadProgress, saveProgress, type Progress } from "@/lib/skill-map/progress";
import { rankOf, type Rank } from "@/lib/skill-map/rank";
import { readyNext } from "@/lib/skill-map/ready-next";
import type { SkillMap } from "@/lib/skill-map/types";
import Awakening from "./Awakening";
import { CurrentSkillWindow, SkillLog, StatusWindow, type Standing } from "./Dashboard";
import JobChange from "./JobChange";
import { LevelUp, Notifications, SkillDetail, SkillMapWindow } from "./Overlays";
import { loadSoundSetting, play, setSoundEnabled } from "./sound";

const SystemBackdrop = dynamic(() => import("./SystemBackdrop"), { ssr: false });

type Screen = "loading" | "awakening" | "job-change" | "dashboard";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The home page: the System that walks a Learner through the Skill map as quests. */
export default function SystemHome({ map }: { map: SkillMap }) {
  const [progress, setProgress] = useState<Progress>({
    learned: new Set(),
    branch: null,
    current: null,
    onboarded: false,
  });
  const [screen, setScreen] = useState<Screen>("loading");
  const [recommended, setRecommended] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [levelUp, setLevelUp] = useState<{ level: number; rank: Rank; rankedUp: boolean } | null>(null);
  const [burst, setBurst] = useState(0);
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([]);
  const [sound, setSound] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [still, setStill] = useState(true);
  const noteId = useRef(0);

  const ids = useMemo(
    () => ({ skills: new Set(map.skills.map((s) => s.id)), branches: new Set(map.branches.map((b) => b.id)) }),
    [map],
  );
  const byId = useMemo(() => new Map(map.skills.map((s) => [s.id, s])), [map]);

  // Saved progress, device capabilities and a ?skill= link are only readable after hydration.
  useEffect(() => {
    const saved = loadProgress(window.localStorage, ids);
    const fromUrl = new URLSearchParams(window.location.search).get("skill");
    /* eslint-disable react-hooks/set-state-in-effect */
    setProgress(saved);
    setSound(loadSoundSetting());
    setWebgl(hasWebGL());
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Someone following a link to a Skill sees it straight away; the first visit can wait.
    if (fromUrl && ids.skills.has(fromUrl)) {
      window.history.replaceState(null, "", window.location.pathname);
      setDetail(fromUrl);
      setScreen("dashboard");
    } else setScreen(saved.onboarded ? "dashboard" : "awakening");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ids]);

  const update = useCallback((change: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = change(p);
      saveProgress(window.localStorage, next);
      return next;
    });
  }, []);

  const notify = useCallback((text: string) => {
    const id = ++noteId.current;
    setNotes((n) => [...n.slice(-2), { id, text }]);
    setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 3800);
  }, []);

  const branch = map.branches.find((b) => b.id === progress.branch) ?? null;
  const ready = useMemo(() => readyNext(map.skills, progress.learned), [map, progress.learned]);
  const standing: Standing = {
    learned: progress.learned,
    ready,
    current: progress.current,
    branch,
    level: progress.learned.size,
    rank: rankOf(map, progress.learned, progress.branch),
  };

  const pick = (id: string) => {
    update((p) => ({ ...p, current: id }));
    setDetail(null);
    play("open");
    notify(`Quest accepted: ${byId.get(id)!.title}`);
  };

  const clear = (id: string) => {
    const learned = new Set(progress.learned).add(id);
    const rank = rankOf(map, learned, progress.branch);
    const rankedUp = rank !== standing.rank;
    update((p) => ({ ...p, learned, current: p.current === id ? null : p.current }));
    setDetail(null);
    setLevelUp({ level: learned.size, rank, rankedUp });
    setBurst((b) => b + 1);
    play(rankedUp ? "rankUp" : "levelUp");
    notify(`Quest cleared: ${byId.get(id)!.title}`);
    setTimeout(() => setLevelUp(null), 2400);
  };

  const undo = (id: string) => {
    update((p) => {
      const learned = new Set(p.learned);
      learned.delete(id);
      return { ...p, learned };
    });
    play("click");
  };

  const chooseJob = (id: string) => {
    update((p) => ({ ...p, branch: id, onboarded: true }));
    setScreen("dashboard");
    setBurst((b) => b + 1);
    play("job");
    notify(`Job changed: ${map.branches.find((b) => b.id === id)!.title}`);
  };

  const finishAwakening = ({ known, recommended }: { known: string[]; recommended: string | null }) => {
    update((p) => ({ ...p, learned: new Set([...p.learned, ...known]), onboarded: true }));
    setRecommended(recommended);
    setScreen("job-change");
    play("open");
  };

  const toggleSound = () => {
    setSoundEnabled(!sound);
    setSound(!sound);
    if (!sound) play("open");
  };

  return (
    <div className="relative min-h-dvh text-slate-200">
      {webgl && <SystemBackdrop burst={burst} still={still} />}
      {!webgl && <div aria-hidden className="fixed inset-0 -z-10 bg-[#020617]" />}

      <header className="flex items-center gap-2 px-4 pt-4 sm:px-6">
        <Link
          href="/"
          aria-label="beTshaped.dev home"
          className="flex items-center gap-2 border border-cyan-400/30 bg-[#051024]/70 p-1 backdrop-blur sm:pr-3"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-gradient-to-br from-accent-from via-accent-via to-accent-to font-mono text-xs font-bold text-black">
            T
          </span>
          <span className="hidden font-mono text-sm font-semibold text-slate-100 sm:inline">
            be<span className="gradient-text">T</span>shaped.dev
          </span>
        </Link>
        <Link
          href="/ai-glossary"
          className="border border-cyan-400/20 bg-[#051024]/60 px-3 py-1.5 text-[13px] whitespace-nowrap text-slate-300 backdrop-blur hover:border-cyan-300 hover:text-white"
        >
          AI glossary
        </Link>
        <Link
          href="/agentic-os"
          className="border border-cyan-400/20 bg-[#051024]/60 px-3 py-1.5 text-[13px] whitespace-nowrap text-slate-300 backdrop-blur hover:border-cyan-300 hover:text-white"
        >
          Agentic OS
        </Link>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={sound ? "Turn sound off" : "Turn sound on"}
          aria-pressed={sound}
          className="ml-auto flex h-9 w-9 cursor-pointer items-center justify-center border border-cyan-400/30 bg-[#051024]/70 text-cyan-200 hover:border-cyan-300"
        >
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      <h1 className="sr-only">Skill map</h1>

      {screen === "dashboard" && (
        <main className="mx-auto grid max-w-5xl items-start gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <StatusWindow
            map={map}
            standing={standing}
            onOpenMap={() => {
              setMapOpen(true);
              play("open");
            }}
            onJobChange={() => setScreen("job-change")}
          />
          <CurrentSkillWindow
            map={map}
            standing={standing}
            onPick={pick}
            onClear={clear}
            onDrop={() => update((p) => ({ ...p, current: null }))}
          />
          <div className="lg:col-span-2">
            <SkillLog map={map} standing={standing} onOpen={setDetail} onJobChange={() => setScreen("job-change")} />
          </div>
        </main>
      )}

      {screen === "awakening" && (
        <Awakening
          core={map.skills.filter((s) => s.area === "core")}
          onDone={finishAwakening}
          onSkip={() => {
            update((p) => ({ ...p, onboarded: true }));
            setScreen("dashboard");
          }}
        />
      )}

      {screen === "job-change" && (
        <JobChange
          branches={map.branches}
          recommended={recommended}
          job={progress.branch}
          gates={webgl && !still}
          onChoose={chooseJob}
          onClose={() => {
            update((p) => ({ ...p, onboarded: true }));
            setScreen("dashboard");
          }}
        />
      )}

      {mapOpen && (
        <SkillMapWindow
          map={map}
          standing={standing}
          onClose={() => setMapOpen(false)}
          onOpen={(id) => {
            setMapOpen(false);
            setDetail(id);
          }}
        />
      )}
      {detail && (
        <SkillDetail
          map={map}
          id={detail}
          standing={standing}
          onClose={() => setDetail(null)}
          onPick={pick}
          onClear={clear}
          onUndo={undo}
          onOpen={setDetail}
        />
      )}
      {levelUp && <LevelUp {...levelUp} />}
      <Notifications items={notes} />
    </div>
  );
}
