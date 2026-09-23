"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Flame, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

interface QuizProps {
  questions: QuizQuestion[];
  accent: string;
  title?: string;
}

const CONFETTI_COLORS = ["#34D399", "#F4A6C6", "#FFD43B", "#A78BFA", "#7FC8FF"];

// Deterministic (not Math.random-based, so it stays a pure module-level
// constant) but varied-looking scatter for the results confetti burst.
const CONFETTI_PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const jitter = ((i * 37) % 17) / 17;
  const angle = (i / 22) * Math.PI * 2 + jitter * 0.4;
  const distance = 70 + jitter * 70;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (i * 53) % 360,
    delay: ((i * 29) % 15) / 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {CONFETTI_PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-2 w-2 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 0.4 }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${value}%`, backgroundColor: accent }}
      />
    </div>
  );
}

export default function Quiz({ questions, accent, title = "Quiz Time" }: QuizProps) {
  const [phase, setPhase] = useState<"intro" | "question" | "results">("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const total = questions.length;
  const current = questions[index];
  const isCorrectSelection = selected !== null && selected === current.correctIndex;

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
  };

  const start = () => {
    reset();
    setPhase("question");
  };

  const selectOption = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.correctIndex) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setPhase("results");
    }
  };

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percent >= 70;
  const grade =
    percent === 100
      ? "Perfect Score!"
      : percent >= 70
        ? "Nice Work!"
        : "Keep Practicing";

  return (
    <div
      className="relative my-6 overflow-hidden rounded-2xl border p-6 sm:p-8"
      style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0a` }}
    >
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accent}22` }}
            >
              <Sparkles className="h-6 w-6" style={{ color: accent }} />
            </span>
            <div>
              <h3 className="font-heading text-2xl tracking-tight">{title}</h3>
              <p className="mt-2 font-sans text-sm font-medium text-muted">
                {total} questions · test what you&apos;ve learned so far
              </p>
            </div>
            <button
              type="button"
              onClick={start}
              className="mt-2 rounded-full px-6 py-2.5 font-sans text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: accent }}
            >
              Start Quiz
            </button>
            <p className="font-mono text-xs text-muted/60">Retry as many times as you like.</p>
          </motion.div>
        )}

        {phase === "question" && (
          <motion.div
            key={`q-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-muted/70">
                  <span>
                    Question {index + 1} of {total}
                  </span>
                </div>
                <ProgressBar value={(index / total) * 100} accent={accent} />
              </div>
              <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                <span
                  className={cn(
                    "flex items-center gap-1 transition-colors",
                    streak >= 2 ? "text-orange-400" : "text-muted/50",
                  )}
                >
                  <Flame className="h-3.5 w-3.5" />
                  {streak}
                </span>
                <motion.span
                  key={score}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center gap-1 text-foreground"
                >
                  <Trophy className="h-3.5 w-3.5" style={{ color: accent }} />
                  {score}
                </motion.span>
              </div>
            </div>

            <h3 className="font-heading text-xl tracking-tight sm:text-2xl">{current.question}</h3>

            <div className="mt-5 flex flex-col gap-2.5">
              {current.options.map((option, i) => {
                const isSelected = selected === i;
                const isCorrectAnswer = i === current.correctIndex;
                const revealed = selected !== null;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectOption(i)}
                    disabled={revealed}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left font-sans text-sm font-medium transition-colors",
                      !revealed && "border-border bg-surface hover:border-foreground/30",
                      revealed && isCorrectAnswer && "border-green-500/60 bg-green-500/10 text-foreground",
                      revealed &&
                        isSelected &&
                        !isCorrectAnswer &&
                        "border-red-500/60 bg-red-500/10 text-foreground",
                      revealed && !isSelected && !isCorrectAnswer && "border-border/50 bg-surface/50 opacity-50",
                    )}
                  >
                    <span>{option}</span>
                    {revealed && isCorrectAnswer && <Check className="h-4 w-4 shrink-0 text-green-500" />}
                    {revealed && isSelected && !isCorrectAnswer && (
                      <X className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {selected !== null && current.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="mt-4 font-sans text-sm font-medium leading-relaxed text-muted">
                    <span className={cn("font-bold", isCorrectSelection ? "text-green-500" : "text-red-400")}>
                      {isCorrectSelection ? "Correct — " : "Not quite — "}
                    </span>
                    {current.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {selected !== null && (
              <button
                type="button"
                onClick={next}
                className="mt-5 w-full rounded-xl py-2.5 font-sans text-sm font-bold text-black transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-6"
                style={{ backgroundColor: accent }}
              >
                {index + 1 < total ? "Next Question" : "See Results"}
              </button>
            )}
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex flex-col items-center gap-3 py-6 text-center"
          >
            {passed && <ConfettiBurst />}
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accent}22` }}
            >
              <Trophy className="h-7 w-7" style={{ color: accent }} />
            </span>
            <h3 className="font-heading text-2xl tracking-tight">{grade}</h3>
            <p className="font-sans text-4xl font-bold text-foreground">
              {score}
              <span className="text-muted">/{total}</span>
            </p>
            <p className="font-sans text-sm font-medium text-muted">{percent}% correct</p>
            {bestStreak >= 3 && (
              <span className="flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 font-mono text-xs text-orange-400">
                <Flame className="h-3.5 w-3.5" />
                Best streak: {bestStreak}
              </span>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-3 flex items-center gap-2 rounded-full border border-border px-5 py-2 font-sans text-sm font-bold text-foreground transition-colors hover:border-foreground/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
