import type { ReactNode } from "react";
import { termSlug } from "@/lib/term-slug";

const INLINE_RE =
  /\[([^\]]+)\]\(\.\/([^)]+)\.md\)|\*\*([^*]+)\*\*|`([^`]+)`|(?<![\w])_([^_]+)_(?![\w])|(?<![\w*])\*([^*]+)\*(?![\w*])/g;

export function inline(text: string, onOpen: (slug: string) => void): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1] !== undefined) {
      const slug = termSlug(decodeURIComponent(m[2]));
      out.push(
        <button
          key={key}
          type="button"
          onClick={() => onOpen(slug)}
          className="cursor-pointer underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {m[1]}
        </button>,
      );
    } else if (m[3] !== undefined) out.push(<strong key={key}>{m[3]}</strong>);
    else if (m[4] !== undefined)
      out.push(
        <code key={key} className="rounded bg-black/[0.06] px-1 py-0.5 text-[0.9em]">
          {m[4]}
        </code>,
      );
    else out.push(<em key={key}>{m[5] ?? m[6]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

/** Splits an entry into its definition and the "Usage" dialogue lines. */
export function splitEntry(body: string) {
  const [main, usage = ""] = body.split(/\n_Usage:_\n/);
  return {
    main: main.trim(),
    usage: usage
      .split(/\n{2,}/)
      .map((l) => l.trim().replace(/^"|"$/g, ""))
      .filter(Boolean),
  };
}

/** Renders the definition part of an entry: paragraphs and tables. */
export function DictionaryBody({
  body,
  onOpen,
}: {
  body: string;
  onOpen: (slug: string) => void;
}) {
  const blocks = body.split(/\n{2,}/);
  const nodes: ReactNode[] = blocks.map((block, i) => {
    const lines = block.split("\n");
    if (lines.length > 2 && lines.every((l) => l.trim().startsWith("|"))) {
      const [head, , ...rows] = lines;
      return (
        <div key={i} className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr>
                {splitRow(head).map((c, k) => (
                  <th
                    key={k}
                    className="border-b border-black/25 py-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-widest opacity-60"
                  >
                    {inline(c, onOpen)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, k) => (
                <tr key={k}>
                  {splitRow(r).map((c, j) => (
                    <td key={j} className="border-b border-black/10 py-2 pr-4 align-top">
                      {inline(c, onOpen)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return <p key={i}>{inline(lines.join(" "), onOpen)}</p>;
  });

  return <div className="flex flex-col gap-4 text-[16px] leading-relaxed">{nodes}</div>;
}
