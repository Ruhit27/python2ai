import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  /** Alerts glow brighter, for System notifications. */
  alert?: boolean;
};

/** The glowing blue panel every System message and screen is drawn in. */
export default function SystemWindow({ title, children, className = "", alert }: Props) {
  return (
    <section
      aria-label={title}
      className={`relative border bg-[#051024]/85 backdrop-blur-md ${
        alert
          ? "border-cyan-300/70 shadow-[0_0_40px_rgba(34,211,238,0.35),inset_0_0_30px_rgba(34,211,238,0.12)]"
          : "border-cyan-400/35 shadow-[0_0_24px_rgba(34,211,238,0.18),inset_0_0_24px_rgba(34,211,238,0.06)]"
      } ${className}`}
    >
      {/* Corner brackets. */}
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((c) => (
        <span key={c} aria-hidden className={`pointer-events-none absolute h-3 w-3 border-cyan-300 ${c}`} />
      ))}
      <header className="flex items-center justify-center gap-3 border-b border-cyan-400/25 px-4 py-2">
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/50" />
        <h2 className="font-mono text-[12px] font-semibold tracking-[0.3em] text-cyan-200 uppercase [text-shadow:0_0_12px_rgba(34,211,238,0.8)]">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/50" />
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

/** A System button: outlined in cyan, filled when primary. */
export function SystemButton({
  children,
  onClick,
  primary,
  className = "",
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "children">) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border px-4 py-2 font-mono text-[12px] font-semibold tracking-[0.2em] uppercase transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "border-cyan-300 bg-cyan-400/20 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.45)] hover:bg-cyan-400/35"
          : "border-cyan-400/40 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-400/10"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
