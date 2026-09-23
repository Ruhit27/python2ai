"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Copy, Sparkles } from "lucide-react";

const FENCE_RE = /```(\w*)\n([\s\S]*?)```/g;

function staggerDelay(index: number) {
  return Math.min(index * 0.06, 0.36);
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px] text-foreground">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

/** DOM id for a `## ` heading, shared by the renderer and the summary chips that scroll to it. */
export function headingId(title: string) {
  return (
    "section-" +
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

const WORDS_PER_MINUTE = 200;
// Code is skimmed and copied, not read word by word, so it counts for less.
const CODE_WORD_WEIGHT = 0.3;

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Reading time and `## ` section titles, computed from a lesson's markdown. */
export function getLessonMeta(content: string): { minutes: number; headings: string[] } {
  let codeWords = 0;
  const prose = content.replace(FENCE_RE, (_, _lang: string, code: string) => {
    codeWords += countWords(code);
    return "\n\n";
  });
  const words = countWords(prose);
  const headings = prose
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3).trim());
  const minutes = Math.max(1, Math.round((words + codeWords * CODE_WORD_WEIGHT) / WORDS_PER_MINUTE));
  return { minutes, headings };
}

function renderParagraphs(text: string, accent: string, state: { key: number; leadUsed: boolean }): ReactNode[] {
  const blocks: ReactNode[] = [];
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const para of paragraphs) {
    const lines = para
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const isHeading = lines.length === 1 && lines[0].startsWith("## ");
    const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
    const isQuote = lines.length > 0 && lines.every((l) => l.startsWith("> "));
    const k = state.key++;
    const delay = staggerDelay(k);

    if (isHeading) {
      const title = lines[0].slice(3).trim();
      blocks.push(
        <Reveal key={k} delay={delay}>
          <h2
            id={headingId(title)}
            className="mb-1 mt-10 flex scroll-mt-16 items-center gap-2.5 font-sans text-xl font-bold tracking-tight text-foreground first:mt-6 sm:text-2xl"
          >
            <span className="h-5 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            {renderInline(title)}
          </h2>
        </Reveal>,
      );
    } else if (isQuote) {
      const quoteText = lines.map((l) => l.slice(2)).join(" ");
      blocks.push(
        <Reveal key={k} delay={delay}>
          <blockquote
            className="relative my-6 rounded-r-lg border-l-[3px] py-1 pl-5 font-sans text-xl font-bold leading-snug text-foreground sm:text-2xl"
            style={{ borderColor: accent }}
          >
            {renderInline(quoteText)}
          </blockquote>
        </Reveal>,
      );
    } else if (isList) {
      blocks.push(
        <Reveal key={k} delay={delay}>
          <ul className="my-5 flex flex-col gap-1">
            {lines.map((l, j) => (
              <li
                key={j}
                className="group flex items-start gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[15px] font-medium leading-relaxed text-muted transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <ArrowRight
                  className="mt-[3px] h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: accent }}
                />
                <span>{renderInline(l.slice(2))}</span>
              </li>
            ))}
          </ul>
        </Reveal>,
      );
    } else {
      const isLead = !state.leadUsed;
      state.leadUsed = true;
      blocks.push(
        <Reveal key={k} delay={delay}>
          <p
            className={
              isLead
                ? "mt-1 font-sans text-lg font-medium leading-relaxed text-foreground/90 sm:text-xl"
                : "mt-4 font-sans text-[15px] font-medium leading-relaxed text-muted first:mt-0"
            }
          >
            {renderInline(para)}
          </p>
        </Reveal>,
      );
    }
  }

  return blocks;
}

function CodeBlock({ lang, code, accent, delay }: { lang: string; code: string; accent: string; delay: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <Reveal delay={delay}>
      <div className="my-6 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-white/[0.03] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
          </div>
          <div className="flex items-center gap-3">
            {lang && (
              <span
                className="font-mono text-[11px] font-medium uppercase tracking-wider"
                style={{ color: accent }}
              >
                {lang}
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy code"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        <pre className="overflow-x-auto bg-surface p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
          <code>{code}</code>
        </pre>
      </div>
    </Reveal>
  );
}

function NoteCallout({ text, accent, delay }: { text: string; accent: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className="my-6 flex gap-3 rounded-2xl border p-4"
        style={{ borderColor: `${accent}40`, backgroundColor: `${accent}14` }}
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
        <p className="font-sans text-[15px] font-medium leading-relaxed text-foreground/90">
          {renderInline(text.trim())}
        </p>
      </div>
    </Reveal>
  );
}

/**
 * Renders lightweight markdown into a lively, themed lesson page:
 * paragraphs (first one as a hook line), "- " bullet lists, "> " pull-quotes,
 * inline `code`, ```lang fenced code blocks, and ```note callouts.
 * `accent` is a hex color used to theme quotes, callouts, and list markers.
 */
export function renderLessonContent(content: string, accent: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  const state = { key: 0, leadUsed: false };
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  FENCE_RE.lastIndex = 0;
  while ((match = FENCE_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push(...renderParagraphs(content.slice(lastIndex, match.index), accent, state));
    }
    const lang = match[1];
    const code = match[2].replace(/\n$/, "");
    const k = state.key++;
    if (lang === "note" || lang === "tip") {
      blocks.push(<NoteCallout key={k} text={code} accent={accent} delay={staggerDelay(k)} />);
    } else {
      blocks.push(<CodeBlock key={k} lang={lang} code={code} accent={accent} delay={staggerDelay(k)} />);
    }
    lastIndex = FENCE_RE.lastIndex;
  }
  if (lastIndex < content.length) {
    blocks.push(...renderParagraphs(content.slice(lastIndex), accent, state));
  }

  return blocks;
}
