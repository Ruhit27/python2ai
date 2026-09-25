"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronRight, FileText, Folder, House, Loader2, X } from "lucide-react";
import {
  DAILY_LIMIT,
  type AgentId,
  type AgentResponse,
  type DependencyResult,
  type Digest,
  type LearnResult,
} from "@/lib/agentic-os/types";
import { AGENTS, FILE_TREE, agentInfo, type FileNode } from "./agents";
import type { CoreState } from "./JarvisScene";
import { DEPENDENCY_REPLAY, DEPENDENCY_REPLAY_INPUT, DIGEST_REPLAY, LEARN_REPLAY } from "./replays";

const JarvisScene = dynamic(() => import("./JarvisScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/70">
      Booting core…
    </div>
  ),
});

const LEARN_EXAMPLES = ["How do AI agents use tools?", "Prompt caching", "Python decorators", "RAG vs fine-tuning"];

/** What an Agent panel is showing: a live result, or a recorded run and why. */
type Shown<T> =
  | { kind: "replay"; data: T; reason?: string }
  | { kind: "live"; data: T };

type RunState = { busy: boolean; error: string | null };

function formatReset(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** POSTs to an Agent route and sorts the answer into result, limit, or error. */
async function runAgent<T>(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) return { kind: "limit" as const, resetsAt: String(data.resetsAt) };
  if (!res.ok) return { kind: "error" as const, message: String(data.error ?? "Something went wrong.") };
  return { kind: "ok" as const, ...(data as AgentResponse<T>) };
}

function HudFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative border border-cyan-400/20 bg-[#03101a]/70 backdrop-blur-md ${className}`}>
      {/* Corner brackets */}
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-cyan-300/80" />
      <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-cyan-300/80" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-cyan-300/80" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-cyan-300/80" />
      {children}
    </div>
  );
}

function ReplayBadge({ reason }: { reason?: string }) {
  return (
    <div className="mb-4 border border-amber-300/30 bg-amber-300/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-amber-200/90">
      <span className="uppercase tracking-[0.2em]">Recorded run</span>
      {reason ? <span className="text-amber-100/70"> · {reason}</span> : null}
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-100">
      {children}
      <ArrowUpRight className="size-3" />
    </a>
  );
}

function DigestView({ digest }: { digest: Digest }) {
  return (
    <div className="space-y-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200/50">
        Built {new Date(digest.generatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
      </p>
      {digest.themes.map((theme, t) => (
        <motion.section
          key={theme.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t * 0.12 }}
        >
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">{theme.title}</h3>
          <ul className="space-y-3">
            {theme.items.map((item) => (
              <li key={item.url} className="border-l border-cyan-400/25 pl-3">
                <a href={item.url} target="_blank" rel="noreferrer" className="line-clamp-2 text-sm font-medium text-cyan-50 hover:text-cyan-200">
                  {item.title}
                </a>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-300/80">{item.summary}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400/70">{item.source}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      ))}
    </div>
  );
}

function LearnView({ result }: { result: LearnResult }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-cyan-50">{result.topic}</h3>
      <div className="space-y-3 text-[14px] leading-relaxed text-slate-200/90">
        {result.explanation.split(/\n+/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {result.plan.length > 0 && (
        <div>
          <h4 className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Study plan</h4>
          <ol className="space-y-3">
            {result.plan.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-3"
              >
                <span className="font-mono text-xs text-violet-300/80">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm font-medium text-cyan-50">{step.step}</p>
                  <p className="text-[13px] leading-relaxed text-slate-300/80">{step.detail}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      )}
      <div>
        <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-violet-300">On beTshaped.dev</h4>
        {result.links.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {result.links.map((link) => (
              <li key={link.href + link.title}>
                <Link
                  href={link.href}
                  className="inline-block border border-violet-300/30 px-2.5 py-1 text-[13px] text-violet-100 hover:bg-violet-300/10"
                >
                  <span className="mr-1.5 font-mono text-[10px] uppercase text-violet-300/70">{link.kind}</span>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-slate-400">No glossary entry covers this yet.</p>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<DependencyResult["reports"][number]["status"], string> = {
  "up-to-date": "text-emerald-300 border-emerald-300/30",
  outdated: "text-orange-300 border-orange-300/30",
  "no-notes": "text-slate-300 border-slate-300/30",
  unknown: "text-rose-300 border-rose-300/30",
};

function DependencyView({ result }: { result: DependencyResult }) {
  return (
    <ul className="space-y-4">
      {result.reports.map((report, i) => (
        <motion.li
          key={report.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="border-l border-orange-300/25 pl-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-cyan-50">{report.name}</span>
            <span className="font-mono text-xs text-slate-400">
              {report.current} → {report.latest ?? "?"}
            </span>
            <span className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${STATUS_STYLE[report.status]}`}>
              {report.status.replace(/-/g, " ")}
            </span>
            {report.breaking && (
              <span className="border border-rose-400/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-rose-300">
                breaking
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300/85">{report.summary}</p>
          {report.releasesUrl && (
            <p className="mt-1 text-[12px]">
              <ExternalLink href={report.releasesUrl}>Release notes</ExternalLink>
            </p>
          )}
        </motion.li>
      ))}
    </ul>
  );
}

function FileTreeView() {
  const [open, setOpen] = useState<FileNode | null>(null);

  function renderNodes(nodes: FileNode[], depth: number): ReactNode {
    return nodes.map((node) => (
      <li key={`${depth}-${node.name}`}>
        {node.children ? (
          <>
            <div className="flex items-center gap-1.5 py-0.5 text-slate-300" style={{ paddingLeft: depth * 14 }}>
              <Folder className="size-3.5 text-cyan-300/70" />
              {node.name}
            </div>
            <ul>{renderNodes(node.children, depth + 1)}</ul>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(node)}
            className={`flex w-full items-center gap-1.5 py-0.5 text-left hover:text-cyan-100 ${open === node ? "text-cyan-200" : "text-slate-400"}`}
            style={{ paddingLeft: depth * 14 }}
          >
            <FileText className="size-3.5" />
            {node.name}
          </button>
        )}
      </li>
    ));
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-slate-400">
        Illustrative: one way an Agentic OS could be laid out on disk. It explains the idea; it is not the code this demo
        runs on.
      </p>
      <ul className="font-mono text-[12px]">{renderNodes(FILE_TREE, 0)}</ul>
      {open?.content && (
        <pre className="overflow-x-auto border border-cyan-400/15 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-cyan-100/90">
          {open.content}
        </pre>
      )}
    </div>
  );
}

function AgentPanel({
  id,
  digest,
  onClose,
  onBusyChange,
  onRemaining,
}: {
  id: AgentId;
  /** Loaded by the parent when the Daily digest opens; null while it loads. */
  digest: Shown<Digest> | null;
  onClose: () => void;
  onBusyChange: (busy: boolean) => void;
  onRemaining: (n: number) => void;
}) {
  const agent = agentInfo(id);
  const [tab, setTab] = useState<"run" | "files">("run");
  const [run, setRun] = useState<RunState>({ busy: false, error: null });
  const [learn, setLearn] = useState<Shown<LearnResult>>({ kind: "replay", data: LEARN_REPLAY, reason: "Try your own topic below." });
  const [deps, setDeps] = useState<Shown<DependencyResult>>({
    kind: "replay",
    data: DEPENDENCY_REPLAY,
    reason: "Checked the package.json shown under the box. Paste yours to run it live.",
  });
  const [topic, setTopic] = useState("");
  const [depsText, setDepsText] = useState("");

  async function submit<T>(url: string, body: object, show: (shown: Shown<T>) => void, replay: T) {
    setRun({ busy: true, error: null });
    onBusyChange(true);
    try {
      const outcome = await runAgent<T>(url, body);
      if (outcome.kind === "ok") {
        show({ kind: "live", data: outcome.result });
        if (outcome.remaining !== undefined) onRemaining(outcome.remaining);
      } else if (outcome.kind === "limit") {
        onRemaining(0);
        show({
          kind: "replay",
          data: replay,
          reason: `You've used today's ${DAILY_LIMIT} runs. They refill at ${formatReset(outcome.resetsAt)}.`,
        });
      } else {
        setRun({ busy: false, error: outcome.message });
      }
    } catch {
      setRun({ busy: false, error: "Couldn't reach the Agent. Check your connection." });
    } finally {
      setRun((r) => ({ ...r, busy: false }));
      onBusyChange(false);
    }
  }

  return (
    <motion.aside
      key={id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-x-3 bottom-3 top-[38%] z-20 md:inset-x-auto md:bottom-6 md:right-6 md:top-6 md:w-[440px]"
    >
      <HudFrame className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-3 border-b border-cyan-400/15 p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: agent.color }}>
              Agent · {agent.trigger}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-cyan-50">{agent.name}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-300/80">{agent.tagline}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Agent" className="p-1 text-slate-400 hover:text-cyan-100">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex border-b border-cyan-400/15 font-mono text-[11px] uppercase tracking-[0.2em]">
          {(["run", "files"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 ${tab === t ? "bg-cyan-400/10 text-cyan-100" : "text-slate-400 hover:text-slate-200"}`}
            >
              {t === "run" ? "Run" : "Files"}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-4">
          {tab === "files" ? (
            <FileTreeView />
          ) : (
            <>
              {id === "learn-this" && (
                <form
                  className="mb-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (topic.trim()) submit("/api/agentic-os/learn", { topic }, setLearn, LEARN_REPLAY);
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      maxLength={200}
                      placeholder="What do you want to learn?"
                      className="min-w-0 flex-1 border border-cyan-400/25 bg-black/40 px-3 py-2 text-sm text-cyan-50 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
                    />
                    <button
                      type="submit"
                      disabled={run.busy || !topic.trim()}
                      className="border border-violet-300/40 bg-violet-400/10 px-3 font-mono text-xs uppercase tracking-[0.15em] text-violet-100 hover:bg-violet-400/20 disabled:opacity-40"
                    >
                      Run
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {LEARN_EXAMPLES.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setTopic(example)}
                        className="border border-slate-500/30 px-2 py-0.5 text-[12px] text-slate-300 hover:border-violet-300/50 hover:text-violet-100"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {id === "dependency-check" && (
                <form
                  className="mb-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (depsText.trim()) submit("/api/agentic-os/dependencies", { text: depsText }, setDeps, DEPENDENCY_REPLAY);
                  }}
                >
                  <textarea
                    value={depsText}
                    onChange={(e) => setDepsText(e.target.value)}
                    rows={6}
                    spellCheck={false}
                    placeholder={"Paste a package.json or requirements.txt\n\nfastapi==0.110.0\nlangchain-openai==1.6.0"}
                    className="w-full resize-y border border-cyan-400/25 bg-black/40 p-3 font-mono text-[12px] text-cyan-50 outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-[12px] text-slate-400">Checks up to 8 dependencies.</p>
                    <button
                      type="submit"
                      disabled={run.busy || !depsText.trim()}
                      className="border border-orange-300/40 bg-orange-400/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-orange-100 hover:bg-orange-400/20 disabled:opacity-40"
                    >
                      Run
                    </button>
                  </div>
                </form>
              )}

              {run.error && (
                <p className="mb-4 border border-rose-400/30 bg-rose-400/5 px-3 py-2 text-[13px] text-rose-200">{run.error}</p>
              )}

              {run.busy || (id === "daily-digest" && !digest) ? (
                <div className="flex items-center gap-3 py-10 font-mono text-xs uppercase tracking-[0.25em] text-cyan-200/80">
                  <Loader2 className="size-4 animate-spin" />
                  {id === "daily-digest" ? "Gathering sources…" : id === "learn-this" ? "Thinking…" : "Reading release notes…"}
                </div>
              ) : (
                <>
                  {id === "daily-digest" && digest && (
                    <>
                      {digest.kind === "replay" && <ReplayBadge reason={digest.reason} />}
                      <DigestView digest={digest.data} />
                    </>
                  )}
                  {id === "learn-this" && (
                    <>
                      {learn.kind === "replay" && <ReplayBadge reason={learn.reason} />}
                      <LearnView result={learn.data} />
                    </>
                  )}
                  {id === "dependency-check" && (
                    <>
                      {deps.kind === "replay" && <ReplayBadge reason={deps.reason} />}
                      {deps.kind === "replay" && (
                        <pre className="mb-4 max-h-36 overflow-auto border border-cyan-400/10 bg-black/30 p-2 font-mono text-[11px] text-slate-400">
                          {DEPENDENCY_REPLAY_INPUT}
                        </pre>
                      )}
                      <DependencyView result={deps.data} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </HudFrame>
    </motion.aside>
  );
}

/** Lines the idle console cycles through, taken from the recorded runs. */
const ATTRACT_LINES = [
  `> daily-digest --themes ${DIGEST_REPLAY.themes.length}`,
  ...DIGEST_REPLAY.themes.slice(0, 2).map((t) => `  ✓ ${t.title}: ${t.items[0].title.slice(0, 48)}`),
  `> learn-this "${LEARN_REPLAY.topic}"`,
  ...LEARN_REPLAY.plan.slice(0, 3).map((s, i) => `  ${i + 1}. ${s.step}`),
  `> dependency-check package.json`,
  ...DEPENDENCY_REPLAY.reports.slice(0, 3).map((r) => `  ${r.name} ${r.current} → ${r.latest ?? "?"} [${r.status}]`),
];

function AttractConsole() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const timer = setInterval(() => setCount((c) => (c >= ATTRACT_LINES.length + 4 ? 1 : c + 1)), 900);
    return () => clearInterval(timer);
  }, []);
  const lines = ATTRACT_LINES.slice(Math.max(0, count - 6), count);
  return (
    <HudFrame className="hidden w-[380px] p-3 md:block">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/60">Recorded runs</p>
      <div className="h-[108px] overflow-hidden font-mono text-[11px] leading-[18px] text-cyan-100/80">
        {lines.map((line, i) => (
          <div key={`${count}-${i}`} className={line.startsWith(">") ? "text-cyan-300" : ""}>
            {line}
          </div>
        ))}
        <span className="inline-block h-3 w-1.5 animate-pulse bg-cyan-300/80 align-middle" />
      </div>
    </HudFrame>
  );
}

export default function AgenticOs() {
  const [selected, setSelected] = useState<AgentId | null>(null);
  const [busy, setBusy] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [digest, setDigest] = useState<Shown<Digest> | null>(null);
  const answerTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const digestRequested = useRef(false);

  const onBusyChange = useCallback((next: boolean) => {
    setBusy(next);
    if (!next) {
      // Glow brighter for a moment when an answer lands.
      setAnswering(true);
      clearTimeout(answerTimer.current);
      answerTimer.current = setTimeout(() => setAnswering(false), 2500);
    }
  }, []);

  useEffect(() => () => clearTimeout(answerTimer.current), []);

  const select = useCallback(
    (id: AgentId) => {
      setSelected(id);
      // The digest is shared and cached on the server, so it loads as soon as its panel opens.
      if (id !== "daily-digest" || digestRequested.current) return;
      digestRequested.current = true;
      const fallback: Shown<Digest> = { kind: "replay", data: DIGEST_REPLAY, reason: "Today's digest couldn't be built." };
      onBusyChange(true);
      fetch("/api/agentic-os/digest")
        .then(async (res) => setDigest(res.ok ? { kind: "live", data: (await res.json()).result } : fallback))
        .catch(() => setDigest(fallback))
        .finally(() => onBusyChange(false));
    },
    [onBusyChange],
  );

  const coreState: CoreState = busy ? "thinking" : answering ? "answering" : "idle";

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#02050a] text-cyan-50">
      {/* On wide screens the scene narrows so the open Agent isn't hidden under its panel. */}
      <div className={`absolute inset-y-0 left-0 transition-[right] duration-500 ${selected ? "right-0 md:right-[464px]" : "right-0"}`}>
        <JarvisScene state={coreState} selected={selected} onSelect={select} />
      </div>

      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(34,211,238,0.035)_0px,rgba(34,211,238,0.035)_1px,transparent_1px,transparent_4px)]" />

      <div className="absolute left-4 top-4 z-10 max-w-sm md:left-6 md:top-6">
        <Link
          href="/"
          aria-label="Home"
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-[#03101a]/70 text-cyan-200 backdrop-blur transition-colors hover:border-cyan-300/70 hover:text-cyan-50"
        >
          <House size={18} />
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-300/70">beTshaped.dev · public demo</p>
        <h1 className="mt-2 font-mono text-2xl font-semibold uppercase tracking-[0.25em] text-cyan-50 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] md:text-3xl">
          Agentic OS
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-300/80">
          Three Agents that help developers learn and keep up with their tools. Pick one to run it. No sign-in.
        </p>
        <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.25em]">
          <p className="text-cyan-300/80">
            Core ·{" "}
            <span className={busy ? "text-amber-300" : "text-emerald-300"}>{busy ? "Processing" : "Online"}</span>
          </p>
          <p className="text-slate-400">
            {remaining === null ? `${DAILY_LIMIT} runs a day` : `Runs left today · ${remaining}/${DAILY_LIMIT}`}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-3 md:bottom-6 md:left-6">
        {!selected && <AttractConsole />}
        <nav aria-label="Agents" className={`flex flex-wrap gap-2 ${selected ? "hidden md:flex" : ""}`}>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => select(agent.id)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] backdrop-blur transition-colors ${
                selected === agent.id ? "bg-white/10" : "bg-black/40 hover:bg-white/5"
              }`}
              style={{ borderColor: `${agent.color}66`, color: agent.color }}
            >
              {agent.name}
              <ChevronRight className="size-3" />
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {selected && (
          <AgentPanel
            key={selected}
            id={selected}
            digest={digest}
            onClose={() => setSelected(null)}
            onBusyChange={onBusyChange}
            onRemaining={setRemaining}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
