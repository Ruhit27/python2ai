"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import MiniSearch from "minisearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, House, Info, Search, Volume2, VolumeX, X } from "lucide-react";
import type { DictionaryData } from "@/lib/dictionary";
import { DictionaryBody, inline, splitEntry } from "@/lib/dictionary-content";
import type { LabelData } from "./DictionaryGraph";
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
  const [expanded, setExpanded] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
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
    setExpanded(false);
    setSearchOpen(false);
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

  const matches = useMemo(
    () => (query.trim() ? new Set(search.search(query).map((r) => r.id as string)) : null),
    [search, query],
  );

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
  const results = matches ? data.terms.filter((t) => matches.has(t.slug)) : [];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#ecebe8] text-[#1a1a1a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <DictionaryGraph
            insetRight={insetRight}
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

        <div className="absolute left-6 top-6 flex items-start gap-2">
          <Link href="/" aria-label="Home" className={circleButton}>
            <House size={18} />
          </Link>
          <div className="flex flex-col gap-2">
          {searchOpen ? (
            <div className="w-72 max-w-[calc(100vw-3rem)]">
              <div className="flex items-center gap-2 rounded-full border border-black/25 bg-[#ecebe8]/90 px-4 py-2 backdrop-blur">
                <Search size={16} className="shrink-0 opacity-60" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                <ul className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-black/25 bg-[#ecebe8]/95 py-1 text-sm backdrop-blur">
                  {results.length === 0 && <li className="px-4 py-2 opacity-60">No matches</li>}
                  {results.map((t) => (
                    <li key={t.slug}>
                      <button
                        type="button"
                        onClick={() => select(t.slug)}
                        className="w-full cursor-pointer px-4 py-1.5 text-left hover:bg-black/10"
                      >
                        {t.title}
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

        <div className="absolute top-6 transition-[right] duration-300" style={{ right: insetRight + 24 }}>
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
          aria-label={soundOn ? "Mute sound" : "Turn sound on"}
          aria-pressed={soundOn}
          onClick={() => setSoundOn((v) => !v)}
          className={`${circleButton} absolute bottom-6 transition-[right] duration-300`}
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
          className="absolute inset-x-0 bottom-0 z-10 flex max-h-[80%] flex-col border-t border-black/20 bg-[#f4f3f1] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:bottom-auto lg:max-h-none lg:w-[42%] lg:min-w-[420px] lg:max-w-[640px] lg:border-l lg:border-t-0"
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
                <DictionaryBody body={entry.main} onOpen={select} collapsed={!expanded} />
              </div>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className={`${label} mt-5 flex cursor-pointer items-center gap-1 hover:text-black`}
              >
                {expanded ? "Read less" : "Read more"}
                <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
              </button>
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
