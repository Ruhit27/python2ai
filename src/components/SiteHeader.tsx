import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Stats", href: "/stats" },
  { label: "Sponsor", href: "/sponsor" },
];

/** Logo on the left, site links on the right. Used by every page outside a glossary. */
export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" aria-label="allglossary.xyz home">
        <Logo />
      </Link>
      <nav>
        <ul className="flex items-center gap-5 sm:gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-black/60 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
