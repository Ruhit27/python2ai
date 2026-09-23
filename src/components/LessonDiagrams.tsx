"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

function DiagramFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="my-6 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      <figcaption className="mt-3 text-center font-mono text-[11px] text-muted/70">{label}</figcaption>
    </figure>
  );
}

function Panel({ title, tone, children }: { title: string; tone: "bad" | "good"; children: ReactNode }) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border p-3"
      style={{
        borderColor: tone === "bad" ? "#f8717140" : "#4ade8040",
        backgroundColor: tone === "bad" ? "#f8717110" : "#4ade8010",
      }}
    >
      <p
        className="font-mono text-[11px] font-medium uppercase tracking-wider"
        style={{ color: tone === "bad" ? "#f87171" : "#4ade80" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Chip({ children, accent, muted }: { children: ReactNode; accent?: string; muted?: boolean }) {
  return (
    <span
      className="rounded-md border px-2 py-1 font-mono text-[12px]"
      style={{
        borderColor: accent ? `${accent}55` : "var(--border)",
        backgroundColor: accent ? `${accent}14` : "transparent",
        color: muted ? "var(--muted)" : "var(--foreground)",
      }}
    >
      {children}
    </span>
  );
}

function useReveal(index: number) {
  const reduceMotion = useReducedMotion();
  return reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.35, delay: index * 0.08, ease: "easeOut" as const },
      };
}

function Row({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div className="flex flex-wrap items-center gap-1.5" {...useReveal(index)}>
      {children}
    </motion.div>
  );
}

/** One shared Python versus one isolated environment per project. */
export function VenvDiagram({ accent }: { accent: string }) {
  return (
    <DiagramFrame label="Same two projects, two setups">
      <Panel title="Without venv" tone="bad">
        <Row index={0}>
          <Chip>one shared Python</Chip>
        </Row>
        <Row index={1}>
          <Chip muted>requests 2.19</Chip>
          <Chip muted>requests 2.32</Chip>
        </Row>
        <p className="font-sans text-[13px] font-medium text-muted">
          Project A needs the old version, project B needs the new one. Only one can be installed.
        </p>
      </Panel>
      <Panel title="With venv" tone="good">
        <Row index={0}>
          <Chip accent={accent}>project-a/.venv</Chip>
          <Chip muted>requests 2.19</Chip>
        </Row>
        <Row index={1}>
          <Chip accent={accent}>project-b/.venv</Chip>
          <Chip muted>requests 2.32</Chip>
        </Row>
        <p className="font-sans text-[13px] font-medium text-muted">
          Each project gets its own box of packages, so nothing collides.
        </p>
      </Panel>
    </DiagramFrame>
  );
}

/** Three separate tools collapsing into uv. */
export function UvDiagram({ accent }: { accent: string }) {
  return (
    <DiagramFrame label="What uv replaces">
      <Panel title="Before" tone="bad">
        <Row index={0}>
          <Chip muted>pyenv</Chip>
          <span className="text-[12px] text-muted">install Python versions</span>
        </Row>
        <Row index={1}>
          <Chip muted>venv</Chip>
          <span className="text-[12px] text-muted">create environments</span>
        </Row>
        <Row index={2}>
          <Chip muted>pip</Chip>
          <span className="text-[12px] text-muted">install packages</span>
        </Row>
      </Panel>
      <Panel title="After" tone="good">
        <Row index={0}>
          <Chip accent={accent}>uv</Chip>
          <span className="text-[12px] text-muted">all three jobs, one tool</span>
        </Row>
        <Row index={1}>
          <Chip muted>uv python install</Chip>
        </Row>
        <Row index={2}>
          <Chip muted>uv add</Chip>
          <Chip muted>uv run</Chip>
        </Row>
      </Panel>
    </DiagramFrame>
  );
}
