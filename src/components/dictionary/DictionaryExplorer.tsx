"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import MiniSearch from "minisearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, House, Info, List, Network, Palette, Pause, Play, Search, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import type { DictionaryData } from "@/lib/dictionary";
import { DictionaryBody, inline, splitEntry } from "@/lib/dictionary-content";
import type { LabelData } from "./DictionaryGraph";
import { SECTION_COLORS } from "./colors";
import { playSelect, setSoundEnabled } from "./sound";

const DictionaryGraph = dynamic(() => import("./DictionaryGraph"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// Film-grain texture laid over the whole graph area.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const circleButton =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/25 bg-[#ecebe8]/80 text-[#1a1a1a] backdrop-blur transition-colors hover:bg-black/10";

const label = "font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-black/55";

function GraphLabels({ titles, data }: { titles: string[]; data: LabelData }) {
  const els = useRef<(HTMLSpanElement | null)[]>([]);

  // Follows the 3D scene: reads the positions it writes each frame.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      els.current.forEach((el, i) => {
        if (!el) return;
        const strong = i === data.strong;
        el.style.opacity = String(data.o[i]);
        if (data.o[i] === 0) return;
        el.style.transform = `translate(${data.x[i]}px, ${data.y[i]}px) translate(-50%, -100%)`;
        el.style.fontSize = strong ? "14px" : "10px";
        el.style.fontWeight = strong ? "700" : "400";
        el.style.color = "#000";
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {titles.map((title, i) => (
        <span
          key={title}
          ref={(el) => {
            els.current[i] = el;
          }}
          className="absolute left-0 top-0 whitespace-nowrap font-mono uppercase tracking-widest"
          style={{ opacity: 0 }}
        >
          {title}
        </span>
      ))}
    </div>
  );
}

/** Wraps each search term found in `text` in a bold underline. */
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>;
  const pattern = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return (
    <>
      {text.split(new RegExp(`(${pattern})`, "gi")).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="bg-transparent font-bold text-inherit underline decoration-2 underline-offset-2">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Every term as a plain list, grouped by section or alphabetically. */
function TermList({
  data,
  mode,
  onMode,
  selected,
  onPick,
}: {
  data: DictionaryData;
  mode: "section" | "alpha";
  onMode: (mode: "section" | "alpha") => void;
  selected: string | null;
  onPick: (slug: string) => void;
}) {
  const groups =
    mode === "section"
      ? data.sections.map((section, i) => ({
          title: section.title,
          terms: data.terms.filter((t) => t.section === i),
        }))
      : Object.entries(
          [...data.terms]
            .sort((a, b) => a.title.localeCompare(b.title))
            .reduce<Record<string, DictionaryData["terms"]>>((acc, t) => {
              (acc[t.title[0].toUpperCase()] ??= []).push(t);
              return acc;
            }, {}),
        ).map(([title, terms]) => ({ title, terms }));

  return (
    <div className="mx-auto max-w-2xl px-6 pb-16 pt-24">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold tracking-tighter">All terms</h2>
        <div role="group" aria-label="Group terms" className="flex rounded-full border border-black/25 p-0.5 text-xs">
          {(
            [
              ["section", "By section"],
              ["alpha", "A–Z"],
            ] as const
          ).map(([value, text]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => onMode(value)}
              className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${
                mode === value ? "bg-[#1a1a1a] text-white" : "hover:bg-black/10"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      {groups.map((group) => (
        <section key={group.title} className="mb-8">
          <p className={label}>{group.title}</p>
          <ul className="mt-2">
            {group.terms.map((t) => (
              <li key={t.slug} className="border-b border-black/10">
                <button
                  type="button"
                  onClick={() => onPick(t.slug)}
                  aria-current={t.slug === selected}
                  className="flex w-full cursor-pointer flex-col gap-0.5 px-2 py-3 text-left transition-colors hover:bg-black/5"
                >
                  <span className="text-[17px] font-semibold">{t.title}</span>
                  <span className="line-clamp-2 text-sm text-black/60">{t.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#ecebe8] text-[#1a1a1a]">
      <p className="text-3xl font-extrabold tracking-tighter sm:text-5xl">The AI Coding Dictionary</p>
      <div className="h-[3px] w-44 overflow-hidden bg-black/10">
        <div className="h-full w-1/3 animate-pulse bg-[#1a1a1a]" />
      </div>
    </div>
  );
}

export default function DictionaryExplorer({ data }: { data: DictionaryData }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [colorMode, setColorMode] = useState<"mono" | "section">("mono");
  const [touring, setTouring] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [listMode, setListMode] = useState<"section" | "alpha">("section");
  const [showHint, setShowHint] = useState(false);
  const panelScroll = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [insetRight, setInsetRight] = useState(0);
  const [labelData] = useState<LabelData>(() => ({
    x: new Float32Array(data.terms.length),
    y: new Float32Array(data.terms.length),
    o: new Float32Array(data.terms.length),
    strong: -1,
  }));

  const select = useCallback((slug: string | null) => {
    setSelected(slug);
    if (slug) playSelect();
    else setTouring(false);
    setSearchOpen(false);
    setQuery("");
    setListOpen(false);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("term", slug);
    else url.searchParams.delete("term");
    window.history.replaceState(null, "", url);
  }, []);

  const bySlug = useMemo(() => new Map(data.terms.map((t) => [t.slug, t])), [data]);

  // The graph treats links as undirected; "connects to" lists only outgoing ones.
  const connections = useMemo(() => {
    const map = new Map<string, Set<string>>(data.terms.map((t) => [t.slug, new Set()]));
    for (const t of data.terms)
      for (const l of t.links) {
        map.get(t.slug)?.add(l);
        map.get(l)?.add(t.slug);
      }
    return map;
  }, [data]);

  const search = useMemo(() => {
    const ms = new MiniSearch({
      fields: ["title", "description", "body"],
      idField: "slug",
      searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 4, description: 2 } },
    });
    ms.addAll(data.terms);
    return ms;
  }, [data]);

  // Ranked best-first, so arrow keys and Enter follow relevance.
  const ranked = useMemo(
    () => (query.trim() ? search.search(query).map((r) => r.id as string) : null),
    [search, query],
  );
  const matches = useMemo(() => (ranked ? new Set(ranked) : null), [ranked]);
  const tokens = useMemo(() => query.trim().split(/\s+/).filter(Boolean), [query]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("term");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after hydration
    if (fromUrl && bySlug.has(fromUrl)) setSelected(fromUrl);
  }, [bySlug]);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem("dictionary-sound");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the saved preference is only readable after hydration
    if (saved === "off") setSoundOn(false);
  }, []);

  useEffect(() => {
    setSoundEnabled(soundOn);
    try {
      window.localStorage.setItem("dictionary-sound", soundOn ? "on" : "off");
    } catch {}
  }, [soundOn]);

  // One-line tip until the visitor first interacts; never shown again after.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem("glossary-hint") === "seen";
    } catch {}
    if (seen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the stored flag is only readable after hydration
    setShowHint(true);
    const events = ["pointerdown", "wheel", "keydown"] as const;
    const hide = () => {
      setShowHint(false);
      try {
        window.localStorage.setItem("glossary-hint", "seen");
      } catch {}
      events.forEach((name) => window.removeEventListener(name, hide));
    };
    events.forEach((name) => window.addEventListener(name, hide));
    return () => events.forEach((name) => window.removeEventListener(name, hide));
  }, []);

  useEffect(() => {
    document.getElementById(`search-result-${activeResult}`)?.scrollIntoView({ block: "nearest" });
  }, [activeResult, query]);

  // Guided tour: fly through the terms in curriculum order, pausing on each.
  useEffect(() => {
    if (!touring) return;
    const index = selected ? data.terms.findIndex((t) => t.slug === selected) : -1;
    const next = data.terms[index + 1];
    if (!next) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the tour ends after the last term
      setTouring(false);
      return;
    }
    const timer = setTimeout(() => select(next.slug), index < 0 ? 0 : 7500);
    return () => clearTimeout(timer);
  }, [touring, selected, data.terms, select]);

  // On wide screens the panel sits beside the graph; on narrow ones it is a
  // bottom sheet and covers nothing on the right.
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

  useEffect(() => {
    panelScroll.current?.scrollTo({ top: 0 });
  }, [selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSearchOpen(false);
      setInfoOpen(false);
      setListOpen(false);
      select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const term = selected ? bySlug.get(selected) : null;
  const index = term ? data.terms.indexOf(term) : -1;
  const prev = index > 0 ? data.terms[index - 1] : null;
  const next = index >= 0 && index < data.terms.length - 1 ? data.terms[index + 1] : null;
  const entry = term ? splitEntry(term.body) : null;
  const related = term ? term.links.map((s) => bySlug.get(s)!) : [];
  const results = ranked ? ranked.map((slug) => bySlug.get(slug)!) : [];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#ecebe8] text-[#1a1a1a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <DictionaryGraph
            insetRight={insetRight}
            colorMode={colorMode}
            labelData={labelData}
            terms={data.terms}
            connections={connections}
            selected={selected}
            matches={matches}
            onSelect={select}
          />
        </div>
        <GraphLabels titles={data.terms.map((t) => t.title)} data={labelData} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />

        {touring && (
          <div
            role="progressbar"
            aria-label="Guided tour progress"
            aria-valuemin={1}
            aria-valuemax={data.terms.length}
            aria-valuenow={Math.max(index + 1, 1)}
            className="absolute left-0 top-0 z-30 h-[3px] bg-black/10 transition-[right] duration-300"
            style={{ right: insetRight }}
          >
            <div
              className="h-full bg-[#1a1a1a] transition-[width] duration-700"
              style={{ width: `${((index + 1) / data.terms.length) * 100}%` }}
            />
          </div>
        )}

        {listOpen && (
          <div
            className="absolute inset-y-0 left-0 z-20 overflow-y-auto bg-[#ecebe8]/95 backdrop-blur transition-[right] duration-300"
            style={{ right: insetRight }}
          >
            <TermList data={data} mode={listMode} onMode={setListMode} selected={selected} onPick={select} />
          </div>
        )}

        <p
          aria-hidden
          className={`pointer-events-none absolute bottom-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/20 bg-[#ecebe8]/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] backdrop-blur transition-opacity duration-700 ${
            showHint && !selected && !listOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: `calc(50% - ${insetRight / 2}px)` }}
        >
          Drag to orbit · Scroll to zoom · Click a term
        </p>

        <div className="absolute left-6 top-6 z-30 flex items-start gap-2">
          <Link href="/" aria-label="Home" className={circleButton}>
            <House size={18} />
          </Link>
          <button
            type="button"
            aria-label={touring ? "Pause guided tour" : "Start guided tour"}
            title={touring ? "Pause guided tour" : "Start guided tour"}
            aria-pressed={touring}
            onClick={() => setTouring((v) => !v)}
            className={circleButton}
          >
            {touring ? <Pause size={18} /> : <Play size={18} />}
          </button>
          {touring && (
            <>
              <button
                type="button"
                aria-label="Previous term"
                title="Previous term"
                disabled={!prev}
                onClick={() => prev && select(prev.slug)}
                className={`${circleButton} disabled:cursor-default disabled:opacity-40`}
              >
                <SkipBack size={18} />
              </button>
              <button
                type="button"
                aria-label="Next term"
                title="Next term"
                disabled={!next}
                onClick={() => next && select(next.slug)}
                className={`${circleButton} disabled:cursor-default disabled:opacity-40`}
              >
                <SkipForward size={18} />
              </button>
            </>
          )}
          <button
            type="button"
            aria-label={listOpen ? "Back to the graph" : "Browse terms as a list"}
            title={listOpen ? "Back to the graph" : "Browse terms as a list"}
            aria-pressed={listOpen}
            onClick={() => setListOpen((v) => !v)}
            className={circleButton}
          >
            {listOpen ? <Network size={18} /> : <List size={18} />}
          </button>
          <div className="flex flex-col gap-2">
          {searchOpen ? (
            <div className="w-72 max-w-[calc(100vw-3rem)]">
              <div className="flex items-center gap-2 rounded-full border border-black/25 bg-[#ecebe8]/90 px-4 py-2 backdrop-blur">
                <Search size={16} className="shrink-0 opacity-60" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveResult(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveResult((a) => Math.min(a + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveResult((a) => Math.max(a - 1, 0));
                    } else if (e.key === "Enter" && results[activeResult]) {
                      select(results[activeResult].slug);
                    }
                  }}
                  role="combobox"
                  aria-expanded={matches !== null}
                  aria-controls="search-results"
                  aria-activedescendant={results.length ? `search-result-${activeResult}` : undefined}
                  placeholder="Search the dictionary"
                  aria-label="Search the dictionary"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  className="cursor-pointer opacity-60 hover:opacity-100"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              {matches && (
                <ul
                  id="search-results"
                  role="listbox"
                  className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-black/25 bg-[#ecebe8]/95 py-1 text-sm backdrop-blur"
                >
                  {results.length === 0 && <li className="px-4 py-2 opacity-60">No matches</li>}
                  {results.map((t, i) => (
                    <li key={t.slug} id={`search-result-${i}`} role="option" aria-selected={i === activeResult}>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => select(t.slug)}
                        onMouseMove={() => setActiveResult(i)}
                        className={`flex w-full cursor-pointer flex-col px-4 py-1.5 text-left ${
                          i === activeResult ? "bg-black/10" : ""
                        }`}
                      >
                        <span>
                          <Highlight text={t.title} tokens={tokens} />
                        </span>
                        <span className="line-clamp-1 text-xs text-black/55">
                          <Highlight text={t.description} tokens={tokens} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <button
              type="button"
              aria-label="Search the dictionary"
              onClick={() => setSearchOpen(true)}
              className={circleButton}
            >
              <Search size={18} />
            </button>
          )}
          </div>
        </div>

        <div className="absolute top-6 z-30 transition-[right] duration-300" style={{ right: insetRight + 24 }}>
          <button
            type="button"
            aria-label="About this dictionary"
            aria-expanded={infoOpen}
            onClick={() => setInfoOpen((v) => !v)}
            className={circleButton}
          >
            <Info size={18} />
          </button>
          {infoOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-black/25 bg-[#ecebe8]/95 p-4 text-sm leading-relaxed backdrop-blur">
              <p>
                The vocabulary of AI coding, in plain English. Drag to orbit, scroll to zoom, click a
                term to read it.
              </p>
              <a
                href="https://www.aihero.dev/ai-coding-dictionary"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block underline underline-offset-2"
              >
                Original by aihero.dev
              </a>
            </div>
          )}
        </div>

        <a
          href="https://www.aihero.dev/ai-coding-dictionary"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 left-6 text-lg font-bold tracking-tight"
        >
          AIHero.dev
        </a>

        <button
          type="button"
          aria-label={colorMode === "section" ? "Use grey nodes" : "Color nodes by section"}
          title={colorMode === "section" ? "Use grey nodes" : "Color nodes by section"}
          aria-pressed={colorMode === "section"}
          onClick={() => setColorMode((m) => (m === "section" ? "mono" : "section"))}
          className={`${circleButton} absolute bottom-6 z-30 transition-[right] duration-300`}
          style={{ right: insetRight + 24 + 52 }}
        >
          <Palette size={18} />
        </button>

        {colorMode === "section" && (
          <ul className="pointer-events-none absolute bottom-16 left-6 hidden flex-col gap-1 text-[11px] sm:flex">
            {data.sections.map((section, i) => (
              <li key={section.title} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: SECTION_COLORS[i % SECTION_COLORS.length] }}
                />
                {section.title}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          aria-label={soundOn ? "Mute sound" : "Turn sound on"}
          aria-pressed={soundOn}
          onClick={() => setSoundOn((v) => !v)}
          className={`${circleButton} absolute bottom-6 z-30 transition-[right] duration-300`}
          style={{ right: insetRight + 24 }}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <h1 className="sr-only">The AI Coding Dictionary</h1>
        <article className="sr-only">
          {data.sections.map((s, i) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <dl>
                {data.terms
                  .filter((t) => t.section === i)
                  .map((t) => (
                    <div key={t.slug}>
                      <dt>{t.title}</dt>
                      <dd>{t.description}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          ))}
        </article>
      </div>

      {term && entry && (
        <aside
          ref={panel}
          aria-label={term.title}
          className="absolute inset-x-0 bottom-0 z-10 flex max-h-[80%] flex-col border-t border-black/20 bg-[#f4f3f1] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:max-h-none lg:w-[42%] lg:min-w-[420px] lg:max-w-[640px] lg:border-l lg:border-t-0"
        >
          <div ref={panelScroll} className="flex-1 overflow-y-auto px-6 pb-8 pt-8 sm:px-12 sm:pt-12">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 border-b border-black/15 pb-4">
                <div className="flex items-baseline justify-between">
                  <p className={label}>{data.sections[term.section].title}</p>
                  <p className="font-mono text-sm">
                    <span className="font-bold">{index + 1}</span>
                    <span className="text-black/40"> / {data.terms.length}</span>
                  </p>
                </div>
              </div>
              <button type="button" aria-label="Close" onClick={() => select(null)} className={circleButton}>
                <X size={18} />
              </button>
            </div>

            <h2 className="mt-8 text-5xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl">
              {term.title}
            </h2>
            <p className="mt-6 max-w-[34ch] text-xl leading-snug">{term.description}</p>

            {entry.usage.length > 0 && (
              <section className="mt-10 border-t border-black/15 pt-6">
                <p className={label}>Heard in the wild</p>
                <div className="mt-4 flex flex-col gap-3">
                  {entry.usage.map((line, i) => (
                    <p
                      key={i}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-snug ${
                        i % 2 === 0
                          ? "self-start border border-black/15 bg-white/60"
                          : "self-end bg-[#1a1a1a] text-white"
                      }`}
                    >
                      {inline(line, select)}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-10 border-t border-black/15 pt-6">
                <p className={label}>Connects to</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => select(r.slug)}
                      className="cursor-pointer rounded-full border border-black/30 px-3 py-1 text-[13px] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-10 border-t border-black/15 pt-6">
              <p className={label}>Full definition</p>
              <div className="mt-4">
                <DictionaryBody body={entry.main} onOpen={select} />
              </div>
            </section>
          </div>

          <nav className="grid grid-cols-2 border-t border-black/20">
            {[
              { t: prev, dir: "Prev", icon: <ArrowLeft size={18} /> },
              { t: next, dir: "Next", icon: <ArrowRight size={18} /> },
            ].map(({ t, dir, icon }) => (
              <button
                key={dir}
                type="button"
                disabled={!t}
                onClick={() => t && select(t.slug)}
                className={`flex cursor-pointer items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-black/5 disabled:cursor-default disabled:opacity-30 sm:px-8 ${
                  dir === "Next" ? "flex-row-reverse border-l border-black/20 text-right" : ""
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/30">
                  {icon}
                </span>
                <span className="min-w-0">
                  <span className={`${label} block text-[10px]`}>{dir}</span>
                  <span className="block truncate text-[15px] font-semibold">{t?.title ?? "—"}</span>
                </span>
              </button>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
