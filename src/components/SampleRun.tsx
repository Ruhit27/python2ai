import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

/** One line of a sample run: a typed command, plain program output, or a success line. */
export type SampleRunStep = readonly ["cmd" | "out" | "ok", string];

/** Replays what a finished project prints, so the learner has a target to compare against. */
export default function SampleRun({ steps }: { steps: readonly SampleRunStep[] }) {
  return (
    <Terminal className="max-w-full">
      {steps.map(([kind, text], index) =>
        kind === "cmd" ? (
          <TypingAnimation key={index}>{`> ${text}`}</TypingAnimation>
        ) : (
          <AnimatedSpan key={index} className={kind === "ok" ? "text-green-500" : "text-muted-foreground"}>
            {text}
          </AnimatedSpan>
        ),
      )}
    </Terminal>
  );
}
