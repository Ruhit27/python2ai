"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { Skill } from "@/lib/skill-map/types";
import { play } from "./sound";
import SystemWindow, { SystemButton } from "./SystemWindow";

/** What a Learner wants to build, and the Branch that leads there. */
const GOALS = [
  { label: "Websites people use", branch: "frontend" },
  { label: "Servers & the apps behind them", branch: "backend" },
  { label: "AI tools & agents", branch: "ai" },
  { label: "Charts & insights from data", branch: "data" },
  { label: "Keeping things running in the cloud", branch: "devops" },
  { label: "Not sure yet", branch: null },
] as const;

type Step = "selected" | "experience" | "skill-check" | "goal";

type Props = {
  core: Skill[];
  /** Called once the questions are answered, with Core Skills already known and the Branch to recommend. */
  onDone: (result: { known: string[]; recommended: string | null }) => void;
  onSkip: () => void;
};

/** The first visit: the System selects the Learner as a Player, then asks two questions. */
export default function Awakening({ core, onDone, onSkip }: Props) {
  const [step, setStep] = useState<Step>("selected");
  const [known, setKnown] = useState<Set<string>>(new Set());

  const go = (next: Step) => {
    play("open");
    setStep(next);
  };

  const toggle = (id: string) => {
    play("click");
    setKnown((k) => {
      const next = new Set(k);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#020617]/60 p-4">
      <div
        key={step}
        className="w-full max-w-xl motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in motion-safe:zoom-in-95"
      >
        {step === "selected" && (
          <SystemWindow title="System" alert>
            <p className="text-center font-mono text-sm tracking-wide text-cyan-100">
              [SYSTEM] You have been selected as a <b className="text-cyan-300">Player</b>.
            </p>
            <p className="mt-3 text-center text-[15px] text-slate-300">
              The System will guide you from zero to a T-shaped developer: a broad Core every developer needs, then one
              Job to go deep in. Every quest links to free places to learn.
            </p>
            <p className="mt-5 text-center font-mono text-sm text-cyan-200">Will you accept?</p>
            <div className="mt-5 flex justify-center gap-3">
              <SystemButton primary onClick={() => go("experience")}>
                Accept
              </SystemButton>
              <SystemButton onClick={onSkip}>Skip</SystemButton>
            </div>
          </SystemWindow>
        )}

        {step === "experience" && (
          <SystemWindow title="Question 1 of 2">
            <p className="text-center text-lg text-slate-100">Have you written code before?</p>
            <div className="mt-5 flex justify-center gap-3">
              <SystemButton primary onClick={() => go("skill-check")}>
                Yes
              </SystemButton>
              <SystemButton primary onClick={() => go("goal")}>
                No, I&apos;m new
              </SystemButton>
            </div>
          </SystemWindow>
        )}

        {step === "skill-check" && (
          <SystemWindow title="Skill check">
            <p className="text-center text-[15px] text-slate-300">
              Tick the Core Skills you already know. They count as cleared, so you won&apos;t repeat them.
            </p>
            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {core.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={known.has(s.id)}
                    onClick={() => toggle(s.id)}
                    className={`flex w-full cursor-pointer items-center gap-2 border px-3 py-2 text-left text-[13px] transition-colors ${
                      known.has(s.id)
                        ? "border-cyan-300 bg-cyan-400/15 text-cyan-50"
                        : "border-cyan-400/20 text-slate-300 hover:border-cyan-400/50"
                    }`}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-cyan-300/70">
                      {known.has(s.id) && <Check size={12} />}
                    </span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-center">
              <SystemButton primary onClick={() => go("goal")}>
                Confirm ({known.size})
              </SystemButton>
            </div>
          </SystemWindow>
        )}

        {step === "goal" && (
          <SystemWindow title="Question 2 of 2">
            <p className="text-center text-lg text-slate-100">What do you want to build?</p>
            <div className="mt-5 grid gap-2">
              {GOALS.map((g) => (
                <SystemButton
                  key={g.label}
                  className="text-left normal-case tracking-normal"
                  onClick={() => onDone({ known: [...known], recommended: g.branch })}
                >
                  {g.label}
                </SystemButton>
              ))}
            </div>
          </SystemWindow>
        )}
        {step !== "selected" && (
          <p className="mt-4 text-center">
            <button
              type="button"
              onClick={onSkip}
              className="cursor-pointer font-mono text-[12px] text-slate-500 hover:text-cyan-200"
            >
              Skip the questions
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
