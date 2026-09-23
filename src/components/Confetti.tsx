"use client";

import * as React from "react";
import { motion } from "motion/react";

const DURATION_MS = 2200;

type Piece = {
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
  color: string;
  round: boolean;
};

function makePieces(count: number, spread: number, colors: string[]): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 2 * spread,
    y: 120 + Math.random() * spread * 0.9,
    rotate: (Math.random() - 0.5) * 720,
    size: 6 + Math.random() * 6,
    delay: Math.random() * 0.15,
    color: colors[i % colors.length],
    round: Math.random() > 0.6,
  }));
}

/**
 * One-shot confetti burst that rises, then falls. Mount it with a fresh `key`
 * for each burst; it calls `onDone` and should then be unmounted.
 */
export default function Confetti({
  intensity,
  accent,
  onDone,
}: {
  intensity: "small" | "large";
  accent: string;
  onDone?: () => void;
}) {
  const [pieces] = React.useState(() =>
    intensity === "large"
      ? makePieces(90, 520, [accent, "#ffffff", "#FBBF24", "#F472B6"])
      : makePieces(28, 220, [accent, "#ffffff", "#FBBF24"]),
  );

  React.useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="absolute left-1/2"
        style={{ top: intensity === "large" ? "35%" : "30%" }}
      >
        {pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute block"
            style={{
              width: p.size,
              height: p.size * (p.round ? 1 : 0.5),
              borderRadius: p.round ? "9999px" : 2,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: [0, -p.y * 0.6, p.y],
              opacity: [1, 1, 0],
              rotate: p.rotate,
            }}
            transition={{
              duration: DURATION_MS / 1000 - 0.2,
              delay: p.delay,
              ease: "easeOut",
              times: [0, 0.35, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
