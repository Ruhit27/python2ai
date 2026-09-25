"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { Branch } from "@/lib/skill-map/types";
import { play } from "./sound";
import SystemWindow, { SystemButton } from "./SystemWindow";

const GatesScene = dynamic(() => import("./GatesScene"), { ssr: false });

type Props = {
  branches: Branch[];
  recommended: string | null;
  /** The Learner's Branch now, if any. */
  job: string | null;
  /** False on devices that get the plain version: no WebGL, or reduced motion. */
  gates: boolean;
  onChoose: (id: string) => void;
  onClose: () => void;
};

/** The Job change: one Gate per Branch; entering one makes it the Learner's Job. */
export default function JobChange({ branches, recommended, job, gates, onChoose, onClose }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const labels = useRef(new Map<string, HTMLElement>());
  const pick = (id: string) => {
    play("click");
    setPicked(id);
  };
  const branch = branches.find((b) => b.id === picked);

  const label = (b: Branch) => (
    <>
      {b.id === recommended && (
        <span className="mb-1 block font-mono text-[10px] tracking-[0.25em] text-cyan-300 uppercase">Recommended</span>
      )}
      <span className="block text-[15px] font-bold text-white">{b.title}</span>
      {b.id === job && (
        <span className="block font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase">Your Job</span>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#020617] motion-safe:animate-in motion-safe:fade-in">
      {gates && (
        // The Gates fill the whole screen behind the windows, so the glow has no edge.
        <div className="absolute inset-0">
          <GatesScene branches={branches} recommended={recommended} chosen={picked} onPick={pick} labels={labels} />
          <div className="pointer-events-none absolute inset-0">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                ref={(el) => {
                  if (el) labels.current.set(b.id, el);
                }}
                onClick={() => pick(b.id)}
                className="pointer-events-auto invisible absolute top-0 left-0 w-40 cursor-pointer text-center"
                style={{ textShadow: `0 0 14px ${b.color}` }}
              >
                {label(b)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pointer-events-none relative flex min-h-full flex-col">
        <div className="pointer-events-auto mx-auto w-full max-w-2xl px-4 pt-8">
          <SystemWindow title="Job change quest" alert>
            <p className="text-center text-[15px] text-slate-300">
              The Gates have opened. Each leads to a Job: the one area you&apos;ll go deep in, on top of the Core. You
              can change Job later, but your Rank is measured in the Job you&apos;re in.
            </p>
          </SystemWindow>
        </div>

        {gates ? (
          <div className="flex-1" />
        ) : (
          <div className="pointer-events-auto mx-auto grid w-full max-w-2xl flex-1 content-start gap-2 px-4 pt-6 sm:grid-cols-2">
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => pick(b.id)}
                className="cursor-pointer border bg-[#051024]/80 p-4 text-left transition-colors hover:bg-cyan-400/10"
                style={{ borderColor: picked === b.id ? b.color : `${b.color}66`, boxShadow: `0 0 18px ${b.color}33` }}
              >
                {label(b)}
              </button>
            ))}
          </div>
        )}

        <div className="pointer-events-auto mx-auto w-full max-w-xl px-4 pt-6 pb-8">
          {branch ? (
            <SystemWindow
              title={`Gate: ${branch.title}`}
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
            >
              <p className="text-[15px] text-slate-300">{branch.summary}</p>
              <div className="mt-4 flex justify-center gap-3">
                <SystemButton primary onClick={() => onChoose(branch.id)}>
                  Enter the Gate
                </SystemButton>
                <SystemButton onClick={() => setPicked(null)}>Back</SystemButton>
              </div>
            </SystemWindow>
          ) : (
            <div className="flex justify-center">
              <SystemButton onClick={onClose}>{job ? "Keep my Job" : "Decide later"}</SystemButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
