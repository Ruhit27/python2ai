// The allglossary.xyz mark: an "A" drawn as a small graph of terms, with
// nodes in the first three section colors. Same geometry as src/app/icon.png.
const NODES = [
  { x: 32, y: 13, color: "#2563eb" },
  { x: 15, y: 51, color: "#dc2626" },
  { x: 49, y: 51, color: "#059669" },
];

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <g stroke="#1a1a1a" strokeWidth={5} strokeLinecap="round">
        <line x1={32} y1={13} x2={15} y2={51} />
        <line x1={32} y1={13} x2={49} y2={51} />
        <line x1={21.8} y1={35.8} x2={42.2} y2={35.8} />
      </g>
      {NODES.map((n) => (
        <circle key={n.color} cx={n.x} cy={n.y} r={7} fill={n.color} stroke="#ecebe8" strokeWidth={2} />
      ))}
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-mono text-[15px] font-semibold tracking-tight">
        allglossary<span className="text-black/45">.xyz</span>
      </span>
    </span>
  );
}
